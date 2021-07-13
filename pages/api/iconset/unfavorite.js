import Cookies from 'cookies'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

export default (req, res) => {
  const { iconsetId, _userId } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId') || _userId

  db.serialize(() => {
    db.run(`DELETE FROM FAVORITES WHERE USER_ID=${userId} AND ICONSET_ID=${iconsetId}`, function (err) {
      db.close()
      if(err) {
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
