import * as uuid from 'uuid'
import Cookies from 'cookies'
import { serializeRow } from '../../../package/db/utils'
import path from 'path'

const sqlite3 = require('sqlite3').verbose()
const AUTH_TOKENS = new Map()
const crypto = require('crypto')

export default (req, res) => {
  const { type } = req.query
  if (type === 'github') {
    const clientId = 'bb0aa472b9e73e7900ee'
    const state = uuid.v4()
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000/api/account/redirect&state=${state}`)
  } else if (type === 'account') {
    const { userName, password } = req.body
    const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
    db.serialize(() => {
      db.get(`SELECT ID, PASSWORD, USER_NAME FROM USERS WHERE (USER_NAME="${userName}" OR EMAIL="${userName}") AND USER_TYPE="account"`, (err, row) => {
        if (err) {
          res.status(500).json({
            success: false,
            data: err
          })
          return
        }
        row = serializeRow(row)
        const pwd = crypto.createHmac('sha256', password).digest('hex')
        if (row && row.password === pwd) {
          const newToken = uuid.v4()
          AUTH_TOKENS.set(userName, newToken)
          const cookies = new Cookies(req, res)
          cookies.set('token', newToken)
          cookies.set('user', row.userName)
          cookies.set('userId', row.id)
          res.json({
            success: true,
            data: {
              token: newToken,
              loginType: 'account',
              userName
            }
          })
        } else {
          res.json({
            success: false
          })
        }
      })
    })
  }
}