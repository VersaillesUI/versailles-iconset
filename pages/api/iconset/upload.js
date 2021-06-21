import path from 'path'
import formidable from 'formidable'
import fs from 'fs'
import { optimize } from 'svgo'

function resolvePath(...paths) {
  return path.resolve(process.cwd(), ...paths)
}

const post = async (req, res, id) => {
  const dir = resolvePath('dir/iconset', id)
  const form = new formidable.IncomingForm({
    multiples: true
  })

  let part
  let content = Buffer.from([])

  form.on('end', async () => {
    if (!part) {
      return res.status(500).json({
        success: false
      })
    }
    
    const next = await saveFile(content, id, part)
    if(next) {
      const filename = part.filename
      const stat = fs.statSync(path.join(dir, filename))
      return res.status(201).json({
        success: true,
        data: {
          file: filename,
          fileName: filename.replace(/\.[a-z0-9_-]*$/, ''),
          ext: path.extname(filename),
          stat: {
            size: stat.size,
            atime: stat.atime,
            ctime: stat.ctime
          }
        }
      })
    }
    res.status(500).json({
      success: false
    })
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
          if (item.attributes) {
            delete item.attributes.opacity
            item.attributes.style = ''
            item.attributes.fill = 'currentColor'
          }
        }
      }
    ]
  })
}

const saveFile = async (content, id, part) => {
  try {
    const optmized = optimizeSvg(content.toString('utf-8'))
    const data = Buffer.from(optmized.data)
    const dir = resolvePath('dir/iconset', id)
    const filename = part.filename

    return new Promise((resolve, reject) => {
      fs.stat(dir, (err) => {
        if(err) {
          fs.mkdir(dir, (err) => {
            if(err) {
              reject(new Error('mkdir error'))
              return
            }
            fs.writeFileSync(path.join(dir, filename), data)
            resolve(true)
          })
          return
        }
        fs.writeFileSync(path.join(dir, filename), data)
        resolve(true)
      })
    })
  } catch(err) {
    return Promise.resolve(false)
  }
}

export default (req, res) => {
  if(req.method === "POST") {
    const { id } = req.query
    return post(req, res, id)
  }
  res.status(404).send('Not Found Method')
}

export const config = {
  api: {
    bodyParser: false
  }
}