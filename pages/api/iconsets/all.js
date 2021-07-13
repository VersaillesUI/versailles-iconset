import { serializeRow } from '@/package/db/utils'
import fs from 'fs'
import path from 'path'
import Cookies from 'cookies'

const sqlite3 = require('sqlite3').verbose()
const processRows = rows => rows.map(row => {
  row = serializeRow(row)
  const dir = path.resolve(process.cwd(), 'dir/iconset', String(row.id))
  const stat = fs.statSync(dir)
  if(stat) {
    const files = fs.readdirSync(dir)
    return {
      ...row,
      total: files.length
    }
  }
})

export default (req, res) => {
  const { userId: _userId, font } = req.query
  const cookies = new Cookies(req, res)
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const userId = _userId || cookies.get('userId')

  if(userId) {
    db.all(`SELECT A.ID, A.ICONSET_NAME, A.ALIAS_NAME, A.IS_FONTSET, A.USER_ID, A.CREATE_TIME, 
        (B.USER_ID IS NOT NULL) AS FAVORITED FROM ICONSETS AS A
        LEFT JOIN (SELECT USER_ID, ICONSET_ID FROM FAVORITES WHERE USER_ID=${userId}) AS B ON A.ID=B.ICONSET_ID WHERE A.DELETE_TIME IS NULL AND A.IS_FONTSET=${font}`, (err, rows) => {
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
        data: processRows(rows)
      })
    })
  } else {
    db.serialize(() => {
      db.all(`SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS WHERE DELETE_TIME IS NULL AND IS_FONTSET=${font}`, function (err, rows) {
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
          data: processRows(rows)
        })
      })
    })
  }
}
