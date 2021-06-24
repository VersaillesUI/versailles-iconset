import { serializeRow } from '@/package/db/utils'
import fs from 'fs'
import path from 'path'

const sqlite3 = require('sqlite3').verbose()
const processRows = rows => rows.map(row => {
  row = serializeRow(row)
  const dir = path.resolve(process.cwd(), 'dir/iconset', String(row.id))
  const stat = fs.statSync(dir)
  if (stat) {
    const files = fs.readdirSync(dir)
    return {
      ...row,
      total: files.length
    }
  }
})

export default (req, res) => {
  const { name, id = 0, userId } = req.query

  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    if (name || id) {
      db.get(`SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS WHERE ALIAS_NAME="${name}" OR ID=${id}`, (err, row) => {
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
          data: serializeRow(row)
        })
      })
    } else if (userId) {
      db.all(`SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS WHERE USER_ID=${userId}`, function (err, rows) {
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
          data: processRows(rows)
        })
      })
    } else {
      db.all("SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS", function (err, rows) {
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
          data: processRows(rows)
        })
      })
    }
  })
}
