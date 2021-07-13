import Cookies from 'cookies'
import { AllowMethod } from '@/package/index'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

export default (req, res) => {
  const methods = new AllowMethod(req, res)
  if (methods.isNot('post')) {
    return res.send('Method not allowed')
  }

  const { iconsetId } = req.body
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId')

  db.serialize(() => {
    db.run("INSERT INTO FAVORITES (USER_ID, ICONSET_ID, UPDATE_TIME) VALUES (?, ?, ?)", [userId, iconsetId, Date.now()], function (err) {
      db.close()
      if(err) {
        res.json({
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
