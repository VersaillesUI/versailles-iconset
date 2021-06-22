import path from 'path'
import * as uuid from 'uuid'

const crypto = require('crypto')
const sqlite3 = require('sqlite3').verbose()

export default (req, res) => {
  const { userName, email, password } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const pwd = crypto.createHmac('sha256', password).digest('hex')

  db.serialize(() => {
    db.run(`INSERT INTO USERS (ID, USER_NAME, USER_TYPE, EMAIL, PASSWORD, JOIN_TIME) VALUES (?, ?, ?, ?, ? ,?)`, [uuid.v4(), userName, 'account', email, pwd, Date.now()], (err) => {
      db.close()
      if (err) {
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