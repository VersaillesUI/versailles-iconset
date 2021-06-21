import fs from 'fs'
import path from 'path'
import etag from 'etag'

const DIR_PREFIX = 'dir/iconset/'

export default (req, res) => {
  const { id, file } = req.query
  const fullpath = path.resolve(process.cwd(), `${DIR_PREFIX}${id}/${file}`)
  fs.stat(fullpath, (err, stat) => {
    if(err || stat.isDirectory()) {
      res.status(500).json({
        success: false,
        data: err
      })
      return
    }
    const code = fs.readFileSync(fullpath)
    const ifNoneMatch = req.headers['if-none-match']
    const fileETag = etag(code)
    if (fileETag === ifNoneMatch) {
      res.status(304).send()
      return
    }
    try {
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Content-Length': stat.size,
        'ETag': fileETag,
        'Cache-control': 'no-cache'
      })
      fs.createReadStream(fullpath, {
        encoding: 'utf-8'
      }).pipe(res)
    } catch(err) {
      res.status(500).json({
        success: false,
        data: err
      })
    }
  })
}