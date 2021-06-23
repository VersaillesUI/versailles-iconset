import axios from 'axios'
import Cookies from 'cookies'
import qs from 'querystring'

export default async (req, res) => {
  const clientId = 'bb0aa472b9e73e7900ee'
  const { code, state } = req.query
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
    .then(res => {
      cookies.set('user', res.login, {
        maxAge: 3600000 * 24 * 10
      })
      res.redirect('/')
    })
    .catch((err) => {
      console.warn(err)
      res.redirect('/')
    })
}