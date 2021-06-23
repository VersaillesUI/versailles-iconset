import axios from 'axios'
import Cookies from 'cookies'
import qs from 'querystring'
import * as uuid from 'uuid'
import { AUTH_TOKENS } from '../../../package/index'

const AUTH_TOKENS = AuthMap.getInstance()

export default async (req, res) => {
  const clientId = 'bb0aa472b9e73e7900ee'
  const { code } = req.query
  const accessToken = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: clientId,
    client_secret: 'ea9101af54085726c02193c8ec66c9f7a6b5d2f1',
    code
  }).then(res => res.data)

  const { access_token, token_type, scope } = qs.parse(accessToken)

  const cookies = new Cookies(req, res)

  axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `${token_type} ${scope} ${access_token}`
    }
  })
    .then(res => res.data)
    .then(result => {
      const token = uuid.v4()
      cookies.set('user', result.login)
      cookies.set('userId', result.id)
      cookies.set('token', token)
      AUTH_TOKENS.set(result.id, token)
      res.redirect('/')
    })
    .catch((err) => {
      console.warn(err)
      res.redirect('/')
    })
}