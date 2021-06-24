import path from 'path'
import { serializeRow } from '@/package/db/utils'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { id } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.all(`SELECT A.USER_NAME, A.EMAIL, A.USER_TYPE, B.ROLE_TYPE, B.JOIN_TIME FROM USERS AS A LEFT JOIN IU_RELATION AS B ON A.ID=B.USER_ID WHERE B.ICONSET_ID=${id}`, (err, rows) => {
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