import Cookies from 'cookies'

export default async (req, res) => {
  const cookies = new Cookies(req, res)
  cookies.set('user')
  cookies.set('userId')
  cookies.set('token')
  res.redirect('/')
}