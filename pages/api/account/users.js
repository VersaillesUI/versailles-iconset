import path from 'path'
import { serializeRow } from '@/package/db/utils'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { ids } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    if(ids) {
      db.all(`SELECT ID, USER_NAME, EMAIL, USER_TYPE FROM USERS WHERE ID IN (${ids})`, (err, rows) => {
        db.close()
        if(err) {
          res.status(500).json({
            success: false,
            data: err
          })
          return
        }
        res.json({
          success: true,
          data: rows.map(serializeRow)
        })
      })
    } else {
      db.all(`SELECT ID, USER_NAME, EMAIL, USER_TYPE FROM USERS`, (err, rows) => {
        db.close()
        if(err) {
          res.status(500).json({
            success: false,
            data: err
          })
          return
        }
        res.json({
          success: true,
          data: rows.map(serializeRow)
        })
      })
    }
  })
}