const sqlite3 = require('sqlite3').verbose()
const path = require('path')

function init () {
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.log(err)
      return
    }

    const CREATE_PROJECT_TABLE = `CREATE TABLE ICONSETS (
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
      JOIN_TIME BIGINT
    )`

    const createProjectTable = new Promise((resolve, reject) => {
      db.serialize(function() {
        db.run('DROP TABLE ICONSETS', () => {
          db.run(CREATE_PROJECT_TABLE, (result, err) => {
            if (err) {
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
          if (err) {
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

    Promise.all([createProjectTable, createUserTable]).then(() => {
      db.close()
    }).catch(() => {
      db.close()
    })
  })
}

init()