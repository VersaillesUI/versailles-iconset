import React from 'react'
import Layout from '@/src/layout'
import { makeStyles } from '@material-ui/core'
import Cookie from 'cookie'
import axios from 'axios'
import T from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Cookies from 'cookies'

function Settings (props) {
  const { cookie, iconsets: _iconsets, current, users, owner } = props
  const [cookies] = React.useState(Cookie.parse(cookie || ''))
  const [iconset] = React.useState(current.data)
  const [iconsets] = React.useState(_iconsets.data || [])
  return <Layout cookie={props.cookie} iconset={iconset} iconsets={iconsets}>
    <Box padding="24px 32px" flexGrow={1} overflow="auto">
      <Box display="flex" alignItems="center">
        <T style={{ flexGrow: 1 }} variant="h5" gutterBottom>{iconset.iconsetName} 图标库</T>
        <Button variant="outlined" disableElevation size="medium" color="primary">
          <Box paddingTop="1px">添加子用户权限</Box>
        </Button>
      </Box>
      <T component="div" gutterBottom variant="subtitle1" style={{ paddingTop: 8 }}>
        用户权限管理
      </T>
      <Paper variant="outlined" style={{ marginTop: 8 }}>
        <Table>
          <TableHead style={{
            background: 'rgba(0, 0, 0, 0.02)'
          }}>
            <TableCell component="th" width={200}><strong>用户名</strong></TableCell>
            <TableCell component="th"><strong>邮箱</strong></TableCell>
            <TableCell component="th" width={200}><strong>生效时间</strong></TableCell>
            <TableCell component="th" width={100}><strong>角色</strong></TableCell>
            <TableCell component="th" width={100}><strong>操作</strong></TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell width={200}>{cookies.user}</TableCell>
              <TableCell>{owner.data.email}</TableCell>
              <TableCell width={200}>{moment(iconset.createTime).format('YYYY-MM-DD')}</TableCell>
              <TableCell width={100}>owner</TableCell>
              <TableCell width={100}></TableCell>
            </TableRow>
            {
              Array.isArray(users.data) && users.data.map(user => {
                return <TableRow>
                  <TableCell width={200}>{owner.userName}</TableCell>
                  <TableCell>{owner.email}</TableCell>
                  <TableCell width={200}>{moment(iconset.createTime).format('YYYY-MM-DD')}</TableCell>
                  <TableCell width={100}>owner</TableCell>
                  <TableCell width={100}>
                    <Button>删除</Button>
                  </TableCell>
                </TableRow>
              })
            }
          </TableBody>
        </Table>
        <Box padding="12px 16px 10px">
          <T variant="body2" style={{
            color: '#909090'
          }}>权限所有人可以删除关联用户上传或编辑权限</T>
        </Box>
      </Paper>
    </Box>
  </Layout>
}

Settings.getInitialProps = async ({ req, res, query }) => {
  const iconsetId = query.id
  const cookies = new Cookies(req, res)
  const iconsets = await axios.get(`http://${req.headers.host}/api/iconsets/query`).then(res => res.data)
  const current = await axios.get(`http://${req.headers.host}/api/iconsets/query?id=${iconsetId}`).then(res => res.data)
  const owner = await axios.get(`http://${req.headers.host}/api/account/user?id=${cookies.get('userId')}`).then(res => res.data)
  const users = await axios.get(`http://${req.headers.host}/api/iconset/users?id=${iconsetId}`).then(res => res.data)
  return { cookie: req.headers.cookie, current, iconsets, users, owner }
}

export default Settings