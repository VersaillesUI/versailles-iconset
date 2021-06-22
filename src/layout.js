import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AppsIcon from '@material-ui/icons/Apps'
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet'
import T from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import ListSubheader from '@material-ui/core/ListSubheader'
import axios from 'axios'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import Cookie from 'cookie'
import FaceIcon from '@material-ui/icons/Face'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AppBar from '@material-ui/core/AppBar'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import AddBox from '@material-ui/icons/AddBox'
import CreateProjectModal from '../src/index/CreateProjectModal'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import GithubIcon from '@material-ui/icons/GitHub'
import Popover from '@material-ui/core/Popover'

const useStyles = makeStyles(theme => {
  return {
    main: {
      display: 'flex',
      height: `calc(100vh - 64px)`,
      overflow: 'hidden'
    },
    nav: {
      flexBasis: 270,
      background: theme.palette.grey[50],
      height: '100%',
      flexShrink: 0
    },
    vtext: {
      color: theme.palette.grey[500]
    },
    content: {
      position: 'relative',
      flexGrow: 1,
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${theme.palette.grey[200]}`
    },
    subHeader: {
      padding: theme.spacing(1, 2)
    },
    listItem: {
      cursor: 'pointer'
    },
    dialog: {
      backgroundColor: 'transparent'
    },
    dialogHeader: {
      color: '#fff',
      padding: 40,
      background: theme.palette.primary.light,
      textAlign: 'center',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
    dialogContent: {
      width: 320,
      display: 'flex',
      alignItems: 'center',
      height: 300,
      flexDirection: 'column',
      padding: 32,
      backgroundColor: '#fff'
    },
    github: {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }
})

export default function Layout (props) {
  const { cookie, iconset } = props
  const [showUser, setShowUser] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [iconsets = [], setIconsets] = React.useState(props.iconsets)
  const [showLogin, setShowLogin] = React.useState(false)
  const [cookies] = React.useState(Cookie.parse(cookie || ''))
  const [fetched, setFetched] = React.useState(false)
  const classes = useStyles()

  useEffect(() => {
    if(!iconsets || iconsets.length === 0) {
      fetchIconsets()
    }
  }, [iconsets])

  const handleLoginViaGithub = () => {
    location.href = '/api/account/login?type=github'
  }

  const handleCloseLoginDialog = () => {
    setShowLogin(false)
  }

  const fetchIconsets = () => {
    if(!fetched) {
      axios.get('/api/iconsets/query')
        .then(res => res.data)
        .then(res => {
          if(res.data) {
            setIconsets(res.data)
          }
        })
      setFetched(true)
    }
  }

  const handleCreateIconset = (requestData) => {
    if(!cookies.userId) {
      setShowLogin(true)
      return
    }
    return axios.post('/api/iconset/create', {
      ...requestData,
      userId: cookies.userId
    }).then(() => {
      fetchIconsets()
    })
  }

  const handleClose = () => {
    setShowUser(false)
  }

  const handleShowUser = (evt) => {
    if(cookies && cookies.user) {
      setAnchorEl(evt.currentTarget)
      setShowUser(true)
    } else {
      setShowLogin(true)
    }
  }

  const handleRedirectGithub = () => {
    window.open('https://github.com/VersaillesUI/versailles-iconset', '_blank')
  }

  const handleLoginViaAccount = () => {
    window.open('/account/login?type=account', '_self')
  }

  return <div>
    <AppBar elevation={0}>
      <Toolbar>
        <BeachAccessIcon style={{ fontSize: 25 }} />
        &nbsp;&nbsp;
        <T variant="h6">华宇图标库</T>
        <Box flexGrow={1} />
        <IconButton onClick={handleRedirectGithub} color="secondary">
          <GithubIcon style={{ padding: 1 }} />
        </IconButton>
        <CreateProjectModal onCreate={handleCreateIconset}>
          <IconButton variant="text" color="secondary">
            <AddBox />
          </IconButton>
        </CreateProjectModal>
        <IconButton onClick={handleShowUser} variant="text" color="secondary">
          <AccountBoxIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <main className={classes.main}>
      <div className={classes.nav}>
        <List>
          <ListSubheader className={classes.subHeader}>
            <T variant="body2" className={classes.vtext}>资源列表</T>
          </ListSubheader>
          <a href="/">
            <ListItem selected={iconset === 'all'} className={classes.listItem}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText>
                <T variant="body2">全部</T>
              </ListItemText>
            </ListItem>
          </a>
          <a href="/favorites">
            <ListItem selected={iconset === 'favorites'} className={classes.listItem}>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText>
                <T variant="body2">收藏</T>
              </ListItemText>
            </ListItem>
          </a>
          <a href="/own">
            <ListItem selected={iconset === 'own'} className={classes.listItem}>
              <ListItemIcon>
                <FaceIcon />
              </ListItemIcon>
              <ListItemText>
                <T variant="body2">我的</T>
              </ListItemText>
            </ListItem>
          </a>
          <ListSubheader className={classes.subHeader}>
            <T variant="body2" className={classes.vtext}>图标集</T>
          </ListSubheader>
          {
            iconsets.map(item => {
              return <ListItem
                selected={iconset && (item.id === iconset.id)}
                onClick={() => {
                  location.href = item.aliasName
                }}
                className={classes.listItem}
                key={item.id}>
                <ListItemIcon>
                  <SettingsEthernetIcon />
                </ListItemIcon>
                <ListItemText>
                  <T variant="body2">{item.iconsetName}</T>
                </ListItemText>
              </ListItem>
            })
          }
        </List>
      </div>
      {props.children}
      <Dialog
        onClose={handleCloseLoginDialog}
        PaperProps={{
          className: classes.dialog
        }} open={showLogin}>
        <DialogTitle className={classes.dialogHeader}>华宇图标库</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <T>选择快捷方式登录</T>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" paddingTop={6}>
              <GitHubIcon onClick={handleLoginViaGithub} className={classes.github} style={{ fontSize: 60, padding: 5 }}></GitHubIcon>
              <T variant="overline" style={{ marginTop: 12, color: '#909090' }}>Github</T>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" paddingTop={6} marginLeft={3}>
              <AccountCircleIcon onClick={handleLoginViaAccount} className={classes.github} style={{ fontSize: 60 }}></AccountCircleIcon>
              <T variant="overline" style={{ marginTop: 12, color: '#909090' }}>账号密码</T>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Popover
        anchorEl={anchorEl}
        open={showUser}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <T style={{ padding: '12px 16px' }}>{cookies && cookies.user}</T>
      </Popover>
    </main>
  </div>
}