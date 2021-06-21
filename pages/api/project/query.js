import { serializeRow } from '../../../package/db/utils'
import fs from 'fs'
import path from 'path'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { name } = req.query

  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    if (name) {
      db.get(`SELECT ID, PROJECT_NAME, ICONSET_NAME, CREATE_TIME FROM PROJECTS WHERE ICONSET_NAME="${name}"`, (err, row) => {
        db.close()
        if(err) {
          res.json({
            success: false
          })
          return
        }
        res.json({
          success: true,
          data: serializeRow(row)
        })
      })
    } else {
      db.all("SELECT ID, PROJECT_NAME, ICONSET_NAME, CREATE_TIME FROM PROJECTS", function (err, rows) {
        db.close()
        if(err) {
          res.json({
            success: false
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
