import Cookies from 'cookies'
import qs from 'querystring'
import fetch from 'node-fetch'

export default async (req, res) => {
  const { code } = req.query
  const clientId = 'bb0aa472b9e73e7900ee'
  const accessToken = await fetch('https://github.com/login/oauth/access_token', {
    method: 'post',
    body: JSON.stringify({
      client_id: clientId,
      client_secret: 'ea9101af54085726c02193c8ec66c9f7a6b5d2f1',
      code
    })
  })
    .then(res => res.text())
    .catch(err => {
      console.log('https://github.com/login/oauth/access_token', err)
    })

  const { access_token, token_type, scope } = qs.parse(accessToken)

  const cookies = new Cookies(req, res)

  fetch('https://api.github.com/user', {
    headers: {
      Authorization: `${token_type} ${scope} ${access_token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      cookies.set('user', data.login, {
        maxAge: 3600 * 24 * 10
      })
      res.redirect('/')
    })
    .catch((err) => {
      console.warn('https://api.github.com/user', err)
      res.redirect('/')
    })
}