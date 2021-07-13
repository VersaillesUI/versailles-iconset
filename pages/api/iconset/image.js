import fs from 'fs'
import path from 'path'

const DIR_PREFIX = 'dir/iconset'

export default (req, res) => {
  const { id, file } = req.query
  const fullpath = path.resolve(process.cwd(), DIR_PREFIX, String(id), file)
  fs.stat(fullpath, (err, stat) => {
    if(err || stat.isDirectory()) {
      res.status(500).json({
        success: false,
        data: err
      })
      return
    }
    try {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Cache-control': 'no-cache'
      })
      fs.createReadStream(fullpath).pipe(res)
    } catch(err) {
      res.status(500).json({
        success: false,
        data: err
      })
    }
  })
}