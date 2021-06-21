import fs from 'fs'
import path from 'path'

export default (req, res) => {
  const { id, file } = req.query
  const dir = path.resolve(process.cwd(), 'dir/iconset', id, file)
  fs.stat(dir, (err) => {
    if(err) {
      res.status(500).json({
        success: false,
        data: err
      })
      return
    }
    fs.unlink(dir, (err) => {
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