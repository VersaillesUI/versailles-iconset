import path from 'path'

const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { id = 0 } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.run(`UPDATE ICONSETS SET DELETE_TIME=${Date.now()} WHERE ID=${id}`, (err) => {
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
        success: true
      })
    })
  })
}
