import fs from 'fs'
import path from 'path'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { id, replace } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  db.serialize(() => {
    db.run(`UPDATE ICONSETS SET ALIAS_NAME="${replace}", UPDATE_TIME=${Date.now()} WHERE ID=${id}`, function (err) {
      db.close()
      if(err) {
        res.json({
          success: false,
          data: err
        })
        return
      }
      res.json({
        success: true
      })
    })
  })
}