import * as uuid from 'uuid'

export default (req, res) => {
  const clientId = 'bb0aa472b9e73e7900ee'
  const state = uuid.v4('hyiconset')
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000/api/account/redirect&state=${state}`)
}