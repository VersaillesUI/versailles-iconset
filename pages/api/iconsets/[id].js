import { serializeRow } from '@/package/db/utils'
import path from 'path'
import Cookies from 'cookies'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { id = 0, userId: _userId } = req.query
  const cookies = new Cookies(req, res)
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const userId = _userId || cookies.get('userId')

  if (userId) {
    db.serialize(() => {
      db.get(`SELECT A.ID, A.ICONSET_NAME, A.ALIAS_NAME, A.IS_FONTSET, A.USER_ID, A.CREATE_TIME, (B.USER_ID IS NOT NULL) AS FAVORITED FROM ICONSETS AS A
        LEFT JOIN (
          SELECT USER_ID, ICONSET_ID FROM FAVORITES WHERE USER_ID=${userId}
        ) AS B ON A.ID=B.ICONSET_ID WHERE A.ID=${id} AND A.DELETE_TIME IS NULL`, (err, row) => {
        db.close()
        if(err) {
          console.log(err)
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
    })
  } else {
    db.serialize(() => {
      db.get(`SELECT A.ID, A.ICONSET_NAME, A.ALIAS_NAME, A.IS_FONTSET, A.USER_ID, A.CREATE_TIME FROM ICONSETS AS A WHERE A.ID=${id} AND DELETE_TIME IS NULL`, (err, row) => {
        db.close()
        if(err) {
          console.log(err)
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
    })
  }
}
