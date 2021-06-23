import { serializeRow } from '../../../package/db/utils'
import fs from 'fs'
import path from 'path'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { name, id } = req.query

  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    if (name || id) {
      db.get(`SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS WHERE ALIAS_NAME="${name}" OR ID="${id}"`, (err, row) => {
        db.close()
        if(err) {
          res.json({
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
    } else {
      db.all("SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS", function (err, rows) {
        db.close()
        if(err) {
          res.json({
            success: false,
            data: err
          })
          return
        }
        res.json({
          success: true,
          data: rows.map(row => {
            row = serializeRow(row)
            const dir = path.resolve(process.cwd(), 'dir/iconset', row.id)
            const files = fs.readdirSync(dir)
            return {
              ...row,
              total: files.length
            }
          })
        })
      })
    }
  })
}
