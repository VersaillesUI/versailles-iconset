const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

async function init () {
  // create dir folder
  const dir = path.resolve(process.cwd(), 'dir')

  function mkdir () {
    return new Promise((resolve) => {
      fs.stat(dir, err => {
        if(err) {
          fs.mkdirSync(dir)
        }

        const dbfolder = path.resolve(dir, 'database')

        fs.stat(dbfolder, (err) => {
          if(err) {
            fs.mkdirSync(dbfolder)
          }

          const databaseFile = path.resolve(dir, 'iconset.db')
          fs.stat(databaseFile, err => {
            if(err) {
              fs.writeFileSync(databaseFile, '')
              resolve()
            } else {
              resolve()
            }
          })
        })
      })
    })
  }

  await mkdir()

  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if(err) {
      console.log(err)
      return
    }

    const CREATE_ICONSETS_TABLE = `CREATE TABLE ICONSETS (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      ICONSET_NAME CHAR(50),
      ALIAS_NAME CHAR(50),
      USER_ID CHAR(50) NOT NULL,
      IS_FONTSET INT NOT NULL,
      CREATE_TIME BIGINT NOT NULL,
      UPDATE_TIME BIGINT,
      DELETE_TIME BIGINT
    )`

    const CREATE_USER_TABLE = `CREATE TABLE USERS (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      USER_NAME CHAR(50),
      USER_TYPE CHAT(10),
      PASSWORD CHAR(50),
      EMAIL CHAR(100),
      THIRD_PARTY_ID INTEGER,
      JOIN_TIME BIGINT
    )`

    // create iconsets and user relation table sql
    const CREATE_ICONSETS_USER_TABLE = `CREATE TABLE IU_RELATION (
      ICONSET_ID INTEGER,
      USER_ID INTEGER,
      ROLE_TYPE,
      JOIN_TIME,
      PRIMARY KEY(ICONSET_ID, USER_ID)
    )`

    // create faviorites table sql
    const CREATE_USER_FAVIORITES_TABLE = `CREATE TABLE FAVORITES (
      USER_ID INTEGER,
      ICONSET_ID INTEGER,
      UPDATE_TIME INTEGER,
      PRIMARY KEY(ICONSET_ID, USER_ID)
    )`

    const createIconsetsTable = new Promise((resolve, reject) => {
      db.serialize(function () {
        db.run('DROP TABLE ICONSETS', () => {
          db.run(CREATE_ICONSETS_TABLE, (result, err) => {
            if(err) {
              console.log('create projects table error', err)
              reject()
              return
            } else {
              console.log('create projects table successfully')
              resolve()
            }
          })
        })
      })
    })

    const createUserTable = new Promise((resolve, reject) => {
      db.run('DROP TABLE USERS', () => {
        db.run(CREATE_USER_TABLE, (result, err) => {
          if(err) {
            console.error('create users table error')
            reject()
            return
          } else {
            console.log('create users table successfully')
            resolve()
          }
        })
      })
    })

    const createIURTable = new Promise((resolve, reject) => {
      db.run('DROP TABLE IU_RELATION', () => {
        db.run(CREATE_ICONSETS_USER_TABLE, (result, err) => {
          if(err) {
            console.error('create iu_relation table error')
            reject()
            return
          } else {
            console.log('create iu_relation table successfully')
            resolve()
          }
        })
      })
    })

    const createFavioritesTable = new Promise((resolve, reject) => {
      db.run('DROP TABLE FAVIORITES', () => {
        db.run(CREATE_USER_FAVIORITES_TABLE, (result, err) => {
          if(err) {
            console.error('create faviorites table error')
            reject()
            return
          } else {
            console.log('create faviorites table successfully')
            resolve()
          }
        })
      })
    })

    Promise.all([createIconsetsTable, createUserTable, createIURTable, createFavioritesTable]).then(() => {
      db.close()
    }).catch(() => {
      db.close()
    })
  })
}

init()