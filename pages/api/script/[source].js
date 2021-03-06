import Gulp from 'gulp'
import sqlite3 from 'sqlite3'
import path from 'path'
import through2 from 'through2'
import consolidate from 'gulp-consolidate'
import plumber from 'gulp-plumber'
import babel from 'gulp-babel'
import fs from 'fs'

const { Readable } = require("stream")
const transfer = (res) => through2.obj(function (file, encoding, callback) {
  try {
    res.writeHeader(200, {
      'content-type': `application/javascript; charset=utf-8`
    })
    Readable.from(file._contents).pipe(res)
    this.push(file)
    callback()
  } catch(err) {
    callback(err)
  }
})

const error = (res) => {
  return (err) => {
    res.status(500).json({
      success: false,
      data: err
    })
  }
}

export default (req, res) => {
  const { source, type } = req.query
  const [icon] = source.split('.')
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.get(`SELECT ID FROM ICONSETS WHERE ALIAS_NAME="${icon}"`, function (err, row) {
      db.close()
      if(err) {
        res.json({
          success: false
        })
        return
      }
      const id = row.ID
      const dir = path.resolve(process.cwd(), 'dir/iconset', String(id))
      const base = path.resolve(process.cwd(), 'package/templates')
      fs.stat(dir, (err) => {
        if(err) {
          res.status(500).json({
            success: false,
            data: err
          })
          return
        }
        fs.readdir(dir, (err, files) => {
          if(err) {
            res.json({
              success: false
            })
            return
          }
          const data = files.map(file => {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)
            if(stat.isFile()) {
              const content = fs.readFileSync(filePath).toString('utf-8')
              const filename = file.replace(/\.[a-z0-9_-]*$/, '')
              const exportName = type !== 'react' ? filename : filename.replace(/^[a-z]/, match => match.toUpperCase()).replace(/\-/g, '_')
              return {
                exportName,
                content
              }
            }
            return null
          }).filter(o => o)

          switch(type.toLowerCase()) {
            case 'react':
              Gulp
                .src(['package/templates/js/react.vm'], { base: base })
                .pipe(plumber())
                .pipe(consolidate('lodash', {
                  data
                }))
                .pipe(babel({
                  presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                  ]
                }))
                .once('error', error(res))
                .pipe(transfer(res))
                .once('error', error(res))
              break
            case 'vue2':
              Gulp
                .src(['package/templates/js/vue2.vm'], { base: base })
                .pipe(plumber())
                .pipe(consolidate('lodash', {
                  data,
                  name: icon
                }))
                .pipe(babel({
                  presets: [
                    '@babel/preset-env'
                  ]
                }))
                .once('error', error(res))
                .pipe(transfer(res))
                .once('error', error(res))
              break
            default:
              res.status(500, {
                success: false,
                data: 'Unsupported type'
              })
          }
        })
      })
    })
  })
}

export const config = {
  api: {
    bodyParser: false
  }
}