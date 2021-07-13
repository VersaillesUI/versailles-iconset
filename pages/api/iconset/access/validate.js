import path from 'path'
import { serializeRow } from '@/package/db/utils'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { id } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.get(`SELECT  FROM IU_RELATION WHERE ICONSET_ID=${id}`, (err, rows) => {
      db.close()
      if (err) {
        console.log(err)
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
  })
}