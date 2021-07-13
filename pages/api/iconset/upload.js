import path from 'path'
import formidable from 'formidable'
import fs from 'fs'
import { optimize } from 'svgo'

const INVALID_FILENAME_PATTERN = /^[A-Za-z_\$][A-Za-z0-9_\-\$]*/
const UNICODE_PATTERN = /^ue[a-z0-9]{3}\-/i

function resolvePath (...paths) {
  return path.resolve(process.cwd(), ...paths)
}

const post = async (req, res, id, font) => {
  const dir = resolvePath('dir/iconset', id)
  const form = new formidable.IncomingForm({
    multiples: true
  })

  let part
  let content = Buffer.from([])

  form.on('end', async () => {
    if(!part) {
      return res.status(500).json({
        success: false
      })
    }

    try {
      const filename = await saveFile(content, id, part, font)
      const file = path.resolve(dir, filename)

      fs.stat(file, (err, stat) => {
        if(err) {
          res.status(500).json({
            success: false,
            data: err
          })
          return
        }

        res.status(201).json({
          success: true,
          data: {
            file: filename,
            fileName: filename.replace(/\.[a-z0-9_-]*$/, ''),
            ext: path.extname(filename),
            content: fs.readFileSync(file).toString('utf-8'),
            stat: {
              size: stat.size,
              atime: stat.atime,
              ctime: stat.ctime
            }
          }
        })
      })
    } catch(err) {
      res.status(500).json({
        success: false,
        data: err
      })
    }
  })

  form.on('error', (err) => {
    res.status(500, {
      success: false,
      data: err
    })
  })

  form.parse(req)

  form.onPart = (_part) => {
    part = _part
    part.on('data', (buffer) => {
      content = Buffer.concat([content, buffer])
    })
  }
}

const optimizeSvg = (content) => {
  return optimize(content, {
    plugins: [
      {
        name: 'removeRect',
        type: 'perItem',
        fn: (item) => {
          return !item.isElem('rect')
        }
      },
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeEditorsNSData',
      'cleanupAttrs',
      'mergeStyles',
      'inlineStyles',
      'minifyStyles',
      'cleanupIDs',
      'removeUselessDefs',
      'cleanupNumericValues',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill',
      'cleanupEnableBackground',
      'removeHiddenElems',
      'removeEmptyText',
      'convertEllipseToCircle',
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      'convertPathData',
      'convertTransform',
      'removeEmptyAttrs',
      'removeEmptyContainers',
      'mergePaths',
      'removeUnusedNS',
      'sortDefsChildren',
      'removeTitle',
      'removeDesc',
      {
        name: 'removeOpacity',
        type: 'perItem',
        fn: (item) => {
          if(item.attributes) {
            delete item.attributes.opacity
            item.attributes.style = ''
            item.attributes.fill = 'currentColor'
          }
        }
      }
    ]
  })
}

const saveFile = async (content, id, part, font) => {
  try {
    const isFont = font === '1'
    const dir = resolvePath('dir/iconset', id)

    let data = content
    let filename = part.filename

    if(isFont) {
      data = Buffer.from(optimizeSvg(content.toString('utf-8')).data)
      filename = UNICODE_PATTERN.test(part.filename) ? part.filename.replace(UNICODE_PATTERN, '') : part.filename
      if(!INVALID_FILENAME_PATTERN.test(filename)) {
        return Promise.reject(new Error('Unsupported filename'))
      }

      if(!INVALID_FILENAME_PATTERN.test(filename)) {
        res.status(500).json({
          success: false,
          data: 'Unsupported filename'
        })
        return
      }
    }

    return new Promise((resolve) => {
      fs.stat(dir, (err) => {
        if(err) {
          fs.mkdir(dir, (err) => {
            if(err) {
              throw new Error('mkdir error')
            }
            const file = path.join(dir, filename)
            fs.writeFileSync(file, data)
            resolve(filename)
          })
          return
        }
        const file = path.join(dir, filename)
        fs.writeFileSync(file, data)
        resolve(filename)
      })
    })
  } catch(err) {
    return Promise.reject(new Error(err))
  }
}

export default (req, res) => {
  if(req.method === "POST") {
    const { id, font } = req.query
    return post(req, res, id, font)
  }
  res.status(404).send('Not Found Method')
}

export const config = {
  api: {
    bodyParser: false
  }
}