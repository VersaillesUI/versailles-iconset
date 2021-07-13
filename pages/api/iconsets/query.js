import { serializeRow } from '@/package/db/utils'
import fs from 'fs'
import path from 'path'

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
  const { id = 0, userId } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    // 查询记录(非收藏)
    if (id && !userId) {
      db.get(`SELECT A.ID, A.ICONSET_NAME, A.ALIAS_NAME, A.IS_FONTSET, A.USER_ID, A.CREATE_TIME FROM ICONSETS AS A WHERE A.ID=${id}`, (err, row) => {
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
    }
    // 查询用户某一条数据是否已收藏
    if(id && userId) {
      db.get(`SELECT A.ID, A.ICONSET_NAME, A.ALIAS_NAME, A.IS_FONTSET, A.USER_ID, A.CREATE_TIME, 
        (B.USER_ID IS NOT NULL) AS FAVORITED FROM ICONSETS AS A
        LEFT JOIN FAVORITES AS B ON A.ID=B.ICONSET_ID
        WHERE A.ID=${id} AND B.USER_ID=${userId}`, (err, row) => {
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
    }
    if(!id && userId) {
      db.all(`SELECT A.ID, A.ICONSET_NAME, A.ALIAS_NAME, A.IS_FONTSET, A.USER_ID, A.CREATE_TIME FROM ICONSETS AS A WHERE A.USER_ID=${userId}`, (err, rows) => {
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
    if (!id && !userId) {
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
