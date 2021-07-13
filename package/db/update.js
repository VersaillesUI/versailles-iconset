const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function init () {
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if(err) {
      console.log(err)
      return
    }

    const UPDATE_ICONSETS_TABLE = 'ALTER TABLE ICONSETS ADD DELETE_TIME INTEGER'

    const updateIconsetsTable = new Promise((resolve, reject) => {
      db.serialize(function () {
        db.run(UPDATE_ICONSETS_TABLE, (result, err) => {
          if(err) {
            console.log('update iconsets table error', err)
            reject()
            return
          } else {
            console.log('update iconsets table successfully')
            resolve()
          }
        })
      })
    })

    Promise.all([updateIconsetsTable]).then(() => {
      db.close()
    }).catch(() => {
      db.close()
    })
  })
}

init()