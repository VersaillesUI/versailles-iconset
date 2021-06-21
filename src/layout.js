import React from 'react'
import Head from 'next/head'
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
import { observable } from '../pages/_app'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import Box from '@material-ui/core/Box'
import * as Rx from 'rxjs'

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

export const loginObservable = new Rx.Subject()

export default function Layout (props) {
  const { cookie, project } = props
  const [projects = [], setProjects] = React.useState(props.projects)
  const [showLogin, setShowLogin] = React.useState(false)
  const classes = useStyles()

  const fetchIconsets = () => {
    axios.get('/api/project/query')
      .then(res => res.data)
      .then(res => {
        setProjects(res.data)
      })
  }

  React.useEffect(() => {
    loginObservable.subscribe((val) => {
      setShowLogin(val)
    })

    observable.subscribe(() => {
      fetchIconsets()
    })
  }, [])

  React.useEffect(() => {
    if(!projects || projects.length === 0) {
      fetchIconsets()
    }
  }, [projects])

  const handleLoginViaGithub = () => {
    location.href = '/api/account/login'
  }

  return <div>
    <Toolbar />
    <main className={classes.main}>
      <div className={classes.nav}>
        <List>
          <ListSubheader className={classes.subHeader}>
            <T variant="body2" className={classes.vtext}>资源列表</T>
          </ListSubheader>
          <a href="/">
            <ListItem selected={project === 'all'} className={classes.listItem}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText>
                <T variant="body2">全部</T>
              </ListItemText>
            </ListItem>
          </a>
          <a href="/favorites">
            <ListItem selected={project === 'favorites'} className={classes.listItem}>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText>
                <T variant="body2">个人收藏</T>
              </ListItemText>
            </ListItem>
          </a>
          <ListSubheader className={classes.subHeader}>
            <T variant="body2" className={classes.vtext}>图标集</T>
          </ListSubheader>
          {
            projects.map(item => {
              return <ListItem
                selected={project && (item.id === project.id)}
                onClick={() => {
                  location.href = item.iconsetName
                }}
                className={classes.listItem}
                key={item.id}>
                <ListItemIcon>
                  <SettingsEthernetIcon />
                </ListItemIcon>
                <ListItemText>
                  <T variant="body2">{item.projectName}</T>
                </ListItemText>
              </ListItem>
            })
          }
        </List>
      </div>
      {props.children}
      {
        cookie && <Dialog PaperProps={{
          className: classes.dialog
        }} open={showLogin}>
          <DialogTitle className={classes.dialogHeader}>华宇图标库</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <T>选择快捷方式登录</T>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" paddingTop={6}>
              <GitHubIcon onClick={handleLoginViaGithub} className={classes.github} style={{ fontSize: 60 }}></GitHubIcon>
              <T variant="overline" style={{ marginTop: 12, color: '#909090' }}>Github</T>
            </Box>
          </DialogContent>
        </Dialog>
      }
    </main>
  </div>
}