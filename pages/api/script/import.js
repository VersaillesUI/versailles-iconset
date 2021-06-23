import Gulp from 'gulp'
import sqlite3 from 'sqlite3'
import path from 'path'
import through2 from 'through2'
import consolidate from 'gulp-consolidate'
import plumber from 'gulp-plumber'
import fs from 'fs'

const { Readable } = require("stream")

export default (req, res) => {
  const { name, type } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))

  db.serialize(() => {
    db.get(`SELECT ID FROM ICONSETS WHERE ALIAS_NAME="${name}"`, function (err, row) {
      db.close()
      if(err) {
        res.json({
          success: false
        })
        return
      }
      const id = row.ID
      const dir = path.resolve(process.cwd(), 'dir/iconset', id)
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
            if (stat.isFile()) {
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

          Gulp
            .src([`package/templates/js/import.${type}.vm`], { base: base })
            .pipe(plumber())
            .pipe(consolidate('lodash', {
              data,
              name
            }))
            .once('error', (err) => {
              res.status(500).json({
                success: false,
                data: err
              })
            })
            .pipe(through2.obj(function (file, encoding, callback) {
              try {
                res.writeHeader(200, {
                  'content-type': `application/javascript; charset=utf-8`
                })
                Readable.from(file._contents).pipe(res)
                this.push(file)
                callback()
              } catch (err) {
                callback(err)
              }
            }))
            .once('error', (err) => {
              res.status(500).json({
                success: false,
                data: err
              })
            })
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