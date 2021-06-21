import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import AddBox from '@material-ui/icons/AddBox'
import T from '@material-ui/core/Typography'
import CreateProjectModal from '../src/index/CreateProjectModal'
import * as Rx from 'rxjs'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { loginObservable } from '../src/layout'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'
import cookie from 'cookie'
import GithubIcon from '@material-ui/icons/GitHub'
import '../styles/globals.css'

export const observable = new Rx.Subject()

function MyApp ({ Component, pageProps }) {
  const [showUser, setShowUser] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [cookies] = React.useState(cookie.parse(pageProps.cookie))
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if(jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const handleSuccess = () => {
    observable.next('success')
  }

  const handleClose = () => {
    setShowUser(false)
  }

  const handleShowUser = (evt) => {
    if(cookies.user) {
      setAnchorEl(evt.currentTarget)
      setShowUser(true)
    } else {
      loginObservable.next(true)
    }
  }

  const handleRedirectGithub = () => {
    window.open('https://github.com/VersaillesUI/versailles-iconset', '_blank')
  }

  return <ThemeProvider theme={theme}>
    <AppBar elevation={0}>
      <Toolbar>
        <BeachAccessIcon style={{ fontSize: 25 }} />
        &nbsp;&nbsp;
        <T variant="h6">华宇图标库</T>
        <Box flexGrow={1} />
        <CreateProjectModal onSuccess={handleSuccess}>
          <IconButton variant="text" color="secondary">
            <AddBox />
          </IconButton>
        </CreateProjectModal>
        <IconButton onClick={handleShowUser} variant="text" color="secondary">
          <AccountCircleIcon />
        </IconButton>
        <IconButton onClick={handleRedirectGithub} variant="text" color="secondary">
          <GithubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <CssBaseline />
    <Component {...pageProps} />
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
      <Typography style={{ padding: '12px 16px' }}>{cookies.user}</Typography>
    </Popover>
  </ThemeProvider>
}

export default MyApp
