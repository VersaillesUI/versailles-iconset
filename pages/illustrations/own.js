import Page from './index'
import Cookies from 'cookies'
import axios from 'axios'

Page.nav = 'own'

Page.getNextProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId') || ''
  const displayingSets = await axios.get(`http://${req.headers.host}/api/iconsets/all?userId=${userId}&font=0`).then(res => res.data.data)
  return { displayingSets }
}

export default Page