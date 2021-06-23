import Page from './index'
import Cookies from 'cookies'
import axios from 'axios'

Page.nav = 'own'
Page.getInitialProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId')
  const iconsets = await axios.get(`http://${req.headers.host}/api/iconsets/query?userId=${userId}`).then(res => res.data.data)
  return { cookie: req.headers.cookie, iconsets }
}

export default Page