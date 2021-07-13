import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AppsIcon from '@material-ui/icons/Apps'
import Button from '@material-ui/core/Button'
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
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import AddBox from '@material-ui/icons/AddBox'
import CreateProjectModal from './app/CreateProjectModal'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import GithubIcon from '@material-ui/icons/GitHub'
import Popover from '@material-ui/core/Popover'
import Link from '@material-ui/core/Link'
import Logo from './components/Logo'
import FormatColorTextIcon from '@material-ui/icons/FormatColorText'
import PanoramaIcon from '@material-ui/icons/Panorama'

const Navs = [
  {
    label: '图标库',
    name: 'collections',
    link: '/collections',
  }, {
    label: '插画库',
    name: 'illustrations',
    link: '/illustrations'
  }
]

const useStyles = makeStyles(theme => {
  return {
    main: {
      display: 'flex',
      height: `calc(100vh - 64px)`,
      overflow: 'hidden'
    },
    logo: {
      display: 'inline-flex'
    },
    nav: {
      flexBasis: 210,
      background: theme.palette.grey[50],
      height: '100%',
      flexShrink: 0
    },
    vtext: {
      color: theme.palette.grey[500]
    },
    title: {
      letterSpacing: '0.1em'
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
    login: {
      cursor: 'pointer',
      transition: '0.2s color',
      color: theme.palette.secondary.main,
      '&:hover': {
        color: theme.palette.primary.main
      }
    },
    smallListItem: {
      padding: '4px 20px'
    },
    label: {
      fontSize: 14
    },
    navItem: {
      fontSize: '16px'
    },
    topNavItem: {
      color: theme.palette.grey[600],
      fontSize: 18
    },
    selectedNav: {
      color: theme.palette.grey[50]
    }
  }
})

export default function Layout (props) {
  const { target: name, cookie, iconset, iconsets: _iconsets, nav } = props.appData
  const [showUser, setShowUser] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [iconsets = [], setIconsets] = React.useState(_iconsets)
  const [showLogin, setShowLogin] = React.useState(false)
  const [cookies] = React.useState(Cookie.parse(cookie || ''))
  const [fetched, setFetched] = React.useState(false)
  const [rootPath, setRootPath] = React.useState('')
  const classes = useStyles()

  const handleLoginViaGithub = () => {
    location.href = '/api/account/login?type=github'
  }

  const handleCloseLoginDialog = () => {
    setShowLogin(false)
  }

  React.useEffect(() => {
    if(process.browser) {
      const paths = location.pathname.split('/')
      setRootPath(paths[1])
    }
  })

  const fetchIconsets = (force) => {
    if(!fetched || force) {
      setFetched(true)
      return axios.get('/api/iconsets/all')
        .then(res => res.data)
        .then(res => {
          if(res.data) {
            setIconsets(res.data)
            return res.data
          }
        })
    }
    return Promise.reject()
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
      fetchIconsets(true).then(res => {
        props.onCreated && props.onCreated(res)
      })
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
        <Link className={classes.logo} href="/app">
          <Logo />
        </Link>
        <Box flexGrow={1} display="flex" alignItems="center" marginLeft={12} paddingTop={0.3}>
          {
            Navs.map((o, index) => {
              return <Button
                key={index}
                href={o.link}
                className={clsx([rootPath === o.name && classes.selectedNav, classes.topNavItem])}
                size="large">{o.label}</Button>
            })
          }
        </Box>
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
          <a href={`/${name}`}>
            <ListItem selected={nav === 'all'} className={classes.listItem}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText>
                <div className={classes.navItem}>全部</div>
              </ListItemText>
            </ListItem>
          </a>
          {
            !!cookies.userId && <a href={`/${name}/favorites`}>
              <ListItem selected={nav === 'favorites'} className={classes.listItem}>
                <ListItemIcon>
                  <StarBorderIcon />
                </ListItemIcon>
                <ListItemText>
                  <div className={classes.navItem}>收藏</div>
                </ListItemText>
              </ListItem>
            </a>
          }
          {
            !!cookies.userId && <a href={`/${name}/own`}>
              <ListItem selected={nav === 'own'} className={classes.listItem}>
                <ListItemIcon>
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText>
                  <div className={classes.navItem}>我的</div>
                </ListItemText>
              </ListItem>
            </a>
          }
          <ListSubheader className={classes.subHeader}>
            <T variant="body2" className={classes.vtext}>图标集</T>
          </ListSubheader>
          {
            Array.isArray(iconsets) && iconsets.map(item => {
              return <a href={`/${name}/view/${item.id}`} key={item.id}>
                <ListItem
                  selected={iconset && (item.id === iconset.id)}
                  className={classes.listItem}
                  key={item.id}>
                  <ListItemIcon>
                    {
                      item.isFontset ? <FormatColorTextIcon /> : <PanoramaIcon />
                    }
                  </ListItemIcon>
                  <ListItemText>
                    <div className={classes.navItem}>{item.iconsetName}</div>
                  </ListItemText>
                </ListItem>
              </a>
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
              <GitHubIcon onClick={handleLoginViaGithub} className={classes.login} style={{ fontSize: 60, padding: 5 }}></GitHubIcon>
              <T variant="overline" style={{ marginTop: 12, color: '#909090' }}>Github</T>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" paddingTop={6} marginLeft={3}>
              <AccountCircleIcon onClick={handleLoginViaAccount} className={classes.login} style={{ fontSize: 60 }}></AccountCircleIcon>
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
        <List>
          <ListItem className={classes.smallListItem}>
            <ListItemText className={classes.label}>
              {cookies && cookies.user}
            </ListItemText>
          </ListItem>
          <ListItem className={classes.smallListItem}>
            <ListItemText>
              <Link className={classes.label} href="/api/account/logout">退出</Link>
            </ListItemText>
          </ListItem>
        </List>
      </Popover>
    </main>
  </div>
}