import path from 'path'
import Gulp from 'gulp'
import consolidate from 'gulp-consolidate'
import iconfont from 'gulp-iconfont'
import rename from 'gulp-rename'
import plumber from 'gulp-plumber'
import archiver from 'archiver'
import through2 from 'through2'

const { Readable } = require("stream")

function mapGlyphs (glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) || '' }
}

const readable = (resolve) => through2.obj(function (chunk, encoding, callback) {
  try {
    resolve(Readable.from(chunk._contents))
    callback()
  } catch (err) {
    callback(err)
  }
})

let fontPromise = null

export default (req, res) => {
  const { type = 'font', id, fontName } = req.query
  const baseDir = 'dir/iconset'
  if(type === 'font') {
    try {
      const source = `${baseDir}/${id}/*.svg`

      /** gulp-iconfont: icon font generator */
      const genterateFont = iconfont({
        fontName: fontName,
        prependUnicode: false,
        fontWeight: 400,
        normalize: true,
        fontHeight: 1000,
        centerHorizontally: true,
        formats: ['woff']
      })

      const handleGlyphs = function (glyphs) {
        const options = {
          className: fontName,
          fontName: fontName,
          fontPath: '',
          glyphs: glyphs.map(mapGlyphs)
        }

        const base = path.resolve(process.cwd(), 'package/templates')

        const css = new Promise((resolve, reject) => {
          Gulp
            .src(['package/templates/css.vm'], { base: base })
            .pipe(plumber())
            .pipe(consolidate('lodash', options))
            .pipe(rename(function () {
              return {
                dirname: '',
                basename: fontName,
                extname: ".css"
              }
            }))
            .pipe(readable(resolve))
            .once('error', reject)
        })

        const json = new Promise((resolve, reject) => {
          Gulp
            .src(['package/templates/json.vm'], { base: base })
            .pipe(plumber())
            .pipe(consolidate('lodash', options))
            .pipe(rename(function () {
              return {
                dirname: '',
                basename: fontName,
                extname: ".json"
              }
            }))
            .pipe(readable(resolve))
            .once('error', reject)
        })

        const html = new Promise((resolve, reject) => {
          Gulp
            .src(['package/templates/html.vm'], { base: base })
            .pipe(plumber())
            .pipe(consolidate('lodash', options))
            .pipe(rename(function () {
              return {
                dirname: '',
                basename: fontName,
                extname: ".html"
              }
            }))
            .pipe(readable(resolve))
            .once('error', reject)
        })

        const zip = archiver('zip')
        res.writeHeader(200, {
          'Content-Disposition': `attachment; filename="${fontName}.zip"`
        })
        zip.pipe(res)

        Promise.all([css, json, html, fontPromise])
          .then((streams) => {
            const fileExts = ['.css', '.json', '.html', '.woff']
            streams.forEach((stream, index) => {
              zip.append(stream, { name: fontName + fileExts[index] })
            })
            zip.finalize((err) => {
              if(err) {
                res.writeHeader(500, {
                  'Content-Disposition': ''
                })
                res.json({
                  success: false,
                  data: err
                })
              }
            })
          }).catch((err) => {
            res.status(500).json({
              success: err,
              data: err
            })
          })
      }

      fontPromise = new Promise((resolve, reject) => {
        Gulp
          .src([source], { base: process.cwd() })
          .pipe(plumber())
          .pipe(genterateFont)
          .on('glyphs', handleGlyphs)
          .pipe(through2.obj(function (chunk, encoding, callback) {
            let content
            chunk._contents.on('data', (buffer) => {
              if (!content) {
                content = buffer
              } else {
                content = Buffer.concat([content, buffer])
              }
            })
            chunk._contents.on('end', () => {
              resolve(content)
              callback(content)
            })
            chunk._contents.on('error', (err) => {
              reject(err)
            })
          }))
          .once('error', reject)
      })
    } catch(err) {
      res.status(500).json({
        success: false,
        data: err
      })
    }
  } else {
    res.status(500).json({
      success: false,
      data: '格式不支持'
    })
  }
}
