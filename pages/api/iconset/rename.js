import fs from 'fs'
import path from 'path'

export default (req, res) => {
  const { id, file, replace } = req.body
  const dir = path.resolve(process.cwd(), 'dir/iconset', id, file)
  const newDir = path.resolve(process.cwd(), 'dir/iconset', id, replace + path.extname(file))
  fs.stat(dir, (err) => {
    if(err) {
      res.status(500).json({
        success: false,
        data: err
      })
      return
    }
    fs.rename(dir, newDir, (err) => {
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