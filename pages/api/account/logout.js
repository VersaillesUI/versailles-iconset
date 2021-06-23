import Cookies from 'cookies'
import { AuthMap } from '../../../package/index'

const AUTH_TOKENS = AuthMap.getInstance()

export default async (req, res) => {
  const cookies = new Cookies(req, res)
  AUTH_TOKENS.delete(cookies.get('userId'))
  cookies.set('user')
  cookies.set('userId')
  cookies.set('token')
  res.redirect('/')
}