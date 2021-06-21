const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const uuid = require('uuid')

export default (req, res) => {
  const { projectName, iconsetName } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.run("INSERT INTO PROJECTS (ID, PROJECT_NAME, ICONSET_NAME, CREATE_TIME) VALUES (?, ?, ?, ?)", [uuid.v4(projectName), projectName, iconsetName, Date.now()], function (result, err) {
      db.close()
      if(err) {
        res.json({
          success: false
        })
        return
      }
      res.json({
        success: true,
        data: this.lastID
      })
    })
  })
}
