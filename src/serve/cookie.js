import Cookies from 'cookies'

export default function (req, res) {
  return new Cookies(req, res)
}