import Page from './index'
import axios from 'axios'
import Cookies from 'cookies'

Page.nav = 'favorites'
Page.getNextProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId') || ''
  const displayingSets = await axios.get(`http://${req.headers.host}/api/iconsets/favorites?userId=${userId}&font=0`).then(res => res.data.data)
  return { displayingSets: displayingSets }
}

export default Page