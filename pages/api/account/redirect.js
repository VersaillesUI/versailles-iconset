import axios from 'axios'
import Cookies from 'cookies'
import * as uuid from 'uuid'
import { AuthMap } from '../../../package/index'
import path from 'path'
import https from 'https'
import qs from 'qs'

const httpsAgent = new https.Agent({ keepAlive: false })

const sqlite3 = require('sqlite3').verbose()
const AUTH_TOKENS = AuthMap.getInstance()

export default async (req, res) => {
  const clientId = 'bb0aa472b9e73e7900ee'
  const clientSecret = 'ea9101af54085726c02193c8ec66c9f7a6b5d2f1'
  const { code } = req.query
  const db = new sqlite3.Database(path.resolve(process.cwd(), 'dir/database/iconset.db'))
  const opts = {
    headers: {
      accept: 'application/json'
    },
    httpsAgent
  }

  function fetchAccessToken (retry) {
    return new Promise((resolve) => {
      axios.post(`https://github.com/login/oauth/access_token`, {
        client_id: clientId,
        client_secret: clientSecret,
        code
      }, opts)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          console.log('github redirect', err)
          if(retry) {
            resolve(void (0))
            return
          }
          if(err.errno === -4077) {
            resolve(fetchAccessToken(true))
          } else {
            resolve(void (0))
          }
        })
    })
  }

  let accessToken = await fetchAccessToken()

  if(!accessToken) {
    res.send('Login failed')
    return
  }

  const { access_token, token_type, error } = qs.parse(accessToken)

  if(error) {
    res.send('Login failed')
    return
  }

  const cookies = new Cookies(req, res)

  function fetchUser (retry) {
    axios.get('https://api.github.com/user', {
      headers: {
        accept: 'application/json',
        Authorization: `${token_type} ${access_token}`
      }
    })
      .then(response => {
        const result = response.data
        db.serialize(() => {
          db.get(`SELECT ID FROM USERS WHERE THIRD_PARTY_ID=${result.id || 0}`, (err, row) => {
            if(err) {
              res.send('Login failed')
              return
            }
            if(row) {
              const token = uuid.v4()
              cookies.set('user', result.login)
              cookies.set('userId', row.ID)
              cookies.set('token', token)
              AUTH_TOKENS.set(row.id, token)
              res.redirect('/')
            } else {
              db.run(`INSERT INTO USERS (USER_NAME, USER_TYPE, EMAIL, JOIN_TIME, THIRD_PARTY_ID) VALUES(?, ?, ?, ?, ?)`, [result.login, 'github', result.email, Date.now(), result.id], function (err) {
                if(err) {
                  console.log('github', err)
                  res.send('Login failed')
                }
                const token = uuid.v4()
                cookies.set('user', result.login)
                cookies.set('userId', this.lastID)
                cookies.set('token', token)
                AUTH_TOKENS.set(this.lastID, token)
                res.redirect('/')
              })
            }
          })
        })
      })
      .catch((err) => {
        console.log('github user', err)
        if(retry) {
          res.send('Login failed')
          return
        }
        if(err.errno === -4077) {
          fetchUser(true)
        } else {
          res.send('Login failed')
        }
      })
  }

  fetchUser()
}