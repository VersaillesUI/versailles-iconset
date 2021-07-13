import { AllowMethod } from '@/package/index'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

export default (req, res) => {
  const methods = new AllowMethod(req, res)
  if (methods.isNot('delete')) {
    return res.send('Method not allowed')
  }
  const { iconsetId, userId } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.run(`DELETE FROM IU_RELATION WHERE ICONSET_ID=${Number(iconsetId)} AND USER_ID=${Number(userId)}`, function (err) {
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
