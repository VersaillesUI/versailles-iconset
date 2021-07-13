import React from 'react'
import Layout from '@/src/layout'
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
import AccessModal from '@/src/app/AccessModal'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

function Settings (props) {
  const { cookie, iconsets: _iconsets, current, users: _users, owner } = props
  const [users, setUsers] = React.useState(_users)
  const [cookies] = React.useState(Cookie.parse(cookie || ''))
  const [iconset] = React.useState(current)
  const [iconsets] = React.useState(_iconsets || [])
  const [alertData, setAlertData] = React.useState({ open: false })
  const [open, setOpen] = React.useState(false)
  const [deleteItem, setDeleteItem] = React.useState(null)

  const handleAddUser = (data) => {
    return axios.post('/api/iconset/access/add', {
      iconsetId: iconset.id,
      userId: data.id
    }).then(() => {
      setAlertData({
        open: true,
        message: '添加成功'
      })
      fetchUsers()
    })
      .catch(() => {
        setAlertData({
          open: true,
          type: 'error',
          message: '添加失败'
        })
      })
  }

  const handleCloseSnackbar = () => {
    setAlertData({
      open: false
    })
  }

  const fetchUsers = () => {
    return axios.get(`/api/iconset/users?id=${iconset.id}`)
      .then(res => res.data)
      .then(res => {
        setUsers(res)
      })
  }

  const handleDeleteAccess = (user) => {
    return () => {
      setOpen(true)
      setDeleteItem(user)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleConfirmDeleteAccess = () => {
    const user = deleteItem
    axios.delete(`/api/iconset/access/delete?iconsetId=${iconset.id}&userId=${user.userId}`)
      .then(() => {
        setAlertData({
          open: true,
          message: '删除成功'
        })
        fetchUsers()
      })
      .catch(() => {
        setAlertData({
          open: true,
          type: 'error',
          message: '删除失败'
        })
      })
  }

  return <Layout appData={{
    cookie: props.cookie,
    iconset: iconset,
    iconsets, target: 'illustrations'
  }}>
    <Box padding="24px 32px" flexGrow={1} overflow="auto">
      <Box display="flex" alignItems="center">
        <Box display="flex" flexGrow={1} alignItems="center">
          <Breadcrumbs>
            <Link color="inherit">图标集</Link>
            <Link href={`/app/iconset/${iconset.id}`}>{iconset.iconsetName}</Link>
          </Breadcrumbs>
        </Box>
        <AccessModal id={iconset.id} iconset={iconset} onOk={handleAddUser}>
          <Button variant="outlined" disableElevation size="medium" color="primary">
            <Box paddingTop="1px">添加子用户权限</Box>
          </Button>
        </AccessModal>
      </Box>
      <T component="div" gutterBottom variant="subtitle1" style={{ paddingTop: 8 }}>
        用户权限管理
      </T>
      <Paper variant="outlined" style={{ marginTop: 8 }}>
        <Table>
          <TableHead style={{
            background: 'rgba(0, 0, 0, 0.02)'
          }}>
            <TableRow>
              <TableCell component="th" width={200}><strong>用户名</strong></TableCell>
              <TableCell component="th"><strong>邮箱</strong></TableCell>
              <TableCell component="th" width={200}><strong>生效时间</strong></TableCell>
              <TableCell component="th" width={100}><strong>角色</strong></TableCell>
              <TableCell component="th" width={100}><strong>操作</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell width={200}>{cookies.user}</TableCell>
              <TableCell>{owner.data.email}</TableCell>
              <TableCell width={200}>{moment(iconset.createTime).format('YYYY-MM-DD HH:mm:SS')}</TableCell>
              <TableCell width={100}>owner</TableCell>
              <TableCell width={100}></TableCell>
            </TableRow>
            {
              Array.isArray(users.data) && users.data.map((user) => {
                return <TableRow key={user.userId}>
                  <TableCell width={200}>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell width={200}>{moment(user.joinTime).format('YYYY-MM-DD HH:mm:SS')}</TableCell>
                  <TableCell width={100}>owner</TableCell>
                  <TableCell width={100}>
                    <Button onClick={handleDeleteAccess(user)}>删除</Button>
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
    <Snackbar open={alertData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
      <Alert severity={alertData.type || 'success'} onClose={handleCloseSnackbar}>
        {alertData.message}
      </Alert>
    </Snackbar>
    <Dialog
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>删除 {deleteItem && deleteItem.userName} 权限？</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ width: 400 }}>
          是否确定继续删除该用户编辑权限
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmDeleteAccess} color="primary">
          确定
        </Button>
        <Button onClick={handleCancel} color="primary" autoFocus>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  </Layout>
}

Settings.getInitialProps = async ({ req, res, query }) => {
  const iconsetId = query.id
  const cookies = new Cookies(req, res)
  const iconsets = await axios.get(`http://${req.headers.host}/api/iconsets/all?font=1`).then(res => res.data.data)
  const current = await axios.get(`http://${req.headers.host}/api/iconsets/${iconsetId}`).then(res => res.data.data)
  const owner = await axios.get(`http://${req.headers.host}/api/account/user?id=${cookies.get('userId')}`).then(res => res.data)
  const users = await axios.get(`http://${req.headers.host}/api/iconset/users?id=${iconsetId}`).then(res => res.data)
  return { cookie: req.headers.cookie, current, iconsets, users, owner }
}

export default Settings