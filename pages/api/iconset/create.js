import Cookies from 'cookies'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

export default (req, res) => {
  const { iconsetName, aliasName, isFont, userId: _userId } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId') || _userId

  db.serialize(() => {
    db.run("INSERT INTO ICONSETS (ICONSET_NAME, IS_FONTSET, ALIAS_NAME, USER_ID, CREATE_TIME) VALUES (?, ?, ?, ?, ?)", [iconsetName, isFont ? 1 : 0, aliasName, userId, Date.now()], function (result, err) {
      db.close()
      if(err) {
        res.json({
          success: false
        })
        return
      }
      const base = path.resolve(process.cwd(), 'dir/iconset')
      fs.stat(base, err => {
        if (err) {
          fs.mkdirSync(base)
        }
        fs.mkdirSync(path.resolve(base, String(this.lastID)))
      })
      res.json({
        success: true,
        data: this.lastID
      })
    })
  })
}
