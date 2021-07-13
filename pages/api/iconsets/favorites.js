import Cookies from 'cookies'
import { serializeRow } from '@/package/db/utils'
import { AllowMethod } from '@/package/index'
import fs from 'fs'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

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
  const methods = new AllowMethod(req, res)
  if (methods.isNot('get')) {
    return res.send('Method not allowed')
  }

  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId') || _userId

  db.serialize(() => {
    db.all(`SELECT ID, ICONSET_NAME, ALIAS_NAME, IS_FONTSET, USER_ID, CREATE_TIME FROM ICONSETS WHERE ID IN (
        SELECT ICONSET_ID FROM FAVORITES WHERE USER_ID=${Number(userId)}
      ) AND DELETE_TIME IS NULL AND IS_FONTSET=${font}`, function (err, rows) {
      db.close()
      if(err) {
        res.json({
          success: false
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
