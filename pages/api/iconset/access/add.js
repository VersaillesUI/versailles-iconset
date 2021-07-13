const sqlite3 = require('sqlite3').verbose()
const path = require('path')

export default (req, res) => {
  const { iconsetId, userId, role = 'user' } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.run("INSERT INTO IU_RELATION (ICONSET_ID, USER_ID, ROLE_TYPE, JOIN_TIME) VALUES (?, ?, ?, ?)", [iconsetId, userId, role, Date.now()], function (result, err) {
      db.close()
      if(err) {
        res.status(500).json({
          success: false
        })
        return
      }
      res.json({
        success: true
      })
    })
  })
}
