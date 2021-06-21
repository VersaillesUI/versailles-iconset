const sqlite3 = require('sqlite3').verbose()
const path = require('path')

function init () {
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.log(err)
      return
    }

    const CREATE_PROJECT_TABLE = `CREATE TABLE PROJECTS (
      ID TEXT PRIMARY KEY,
      PROJECT_NAME CHAR(50) NOT NULL,
      ICONSET_NAME CHAR(50) PRIMARY KEY,
      USER_ID CHAR(50) NOT NULL,
      CREATE_TIME BIGINT NOT NULL,
      UPDATE_TIME BIGINT,
      DELETE_TIME BIGINT
    )`

    const CREATE_USER_TABLE = `CREATE TABLE USERS (
      ID TEXT PRIMARY KEY,
      USER_NAME CHAR(50) NOT NULL,
      USER_TYPE CHAT(10),
      JOIN_TIME BIGINT
    )`

    const createProjectTable = new Promise((resolve, reject) => {
      db.serialize(function() {
        db.run('DROP TABLE PROJECTS', () => {
          db.run(CREATE_PROJECT_TABLE, (result, err) => {
            if (err) {
              console.log('create project table error', err)
              reject()
              return
            } else {
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
            console.log('create user table error')
            reject()
            return
          } else {
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