import fs from 'fs'
import path from 'path'

export default (req, res) => {
  const { id, offset = 0, limit } = req.query
  const dir = path.resolve(process.cwd(), 'dir/iconset', id)
  fs.stat(dir, (err, stats) => {
    if(err || stats.isFile()) {
      res.status(500).json({
        success: false
      })
      return
    }
    try {
      const result = []
      let files = fs.readdirSync(dir)
      if (limit) {
        files = files.slice(offset, offset + limit)
      }
      files.forEach(file => {
        const fullpath = path.join(dir, file)
        const stat = fs.statSync(fullpath)
        if(stat.isFile()) {
          result.push({
            file,
            fileName: file.replace(/\.[a-z0-9_-]*$/, ''),
            ext: path.extname(file),
            content: fs.readFileSync(fullpath).toString(),
            stat: {
              size: stat.size,
              atime: stat.atime,
              ctime: stat.ctime
            }
          })
        }
      })
      res.json({
        success: true,
        data: result
      })
    } catch(err) {
      res.status(500).json({
        success: false
      })
    }
  })
}