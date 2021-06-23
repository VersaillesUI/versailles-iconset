import React from 'react'
import Layout from '@/src/layout'
import T from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'
import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SvgIcon from '@/src/components/SvgIcon'
import Cookies from 'cookies'

const useStyles = makeStyles((theme) => {
  return {
    content: {
      position: 'relative',
      flexGrow: 1,
      flexDirection: 'column',
      padding: theme.spacing(2)
    },
    card: {
      width: `calc(25% - 16px)`,
      margin: theme.spacing(2),
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      transition: '0.2s',
      transitionProperty: 'transform, box-shadow',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translate(0px, -2px)',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.32)'
      }
    },
    imageItem: {
      width: `calc(25% - 16px)`,
      padding: `calc((25% - 16px) / 2) 0`,
      margin: 8,
      position: 'relative',
      display: 'inline-flex',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: '50%',
      height: '50%',
      position: 'absolute',
      left: '25%',
      top: '25%',
      fontSize: 28
    },
    cardHeader: {
      padding: theme.spacing(1, 3, 2)
    },
    cardContent: {
      width: '100%',
      padding: '8px!important',
      flexGrow: 1
    }
  }
})

function Page (props) {
  const { iconsets, cookie } = props
  const classes = useStyles()
  const [icons, setIcons] = React.useState([])

  const fetchItem = async (item) => {
    return axios.get(`/api/iconset/query?id=${item.id}&limit=12`).then(res => res.data.data)
  }

  React.useEffect(() => {
    const result = []
    if(Array.isArray(iconsets)) {
      Promise.all(
        iconsets.map((item, index) => {
          return new Promise((resolve) => {
            fetchItem(item).then(res => {
              result[index] = res
              resolve()
            })
          })
        })
      ).then(() => {
        setIcons([...result])
      })
    }
  }, [iconsets])

  return <Layout cookie={cookie} iconset={Page.nav || 'all'} iconsets={props.iconsets}>
    <div className={classes.content}>
      <Box display="flex" flexWrap="wrap" height="auto">
        {
          Array.isArray(iconsets) && iconsets.map((item, index) => {
            const nicons = icons[index]
            return <Card onClick={() => location.href = `/app/iconset/${item.aliasName}`} className={classes.card} key={item.id || index}>
              <CardContent className={classes.cardContent}>
                <Box display="flex" flexWrap="wrap">
                  {
                    Array.apply(this, { length: 12 }).map((_, next) => {
                      const image = nicons && nicons[next]
                      return <div key={(image && image.file) || next} className={classes.imageItem}>
                        {
                          image && <SvgIcon className={classes.image} content={image.content}></SvgIcon>
                        }
                      </div>
                    })
                  }
                </Box>
              </CardContent>
              <CardHeader
                className={classes.cardHeader}
                title={(
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1} display="flex" alignItems="center">
                      <AccountCircleIcon />
                      &nbsp;
                      <T variant="body1">{item.iconsetName} - {item.aliasName}</T>
                    </Box>
                    <Box>
                      <T variant="button">
                        {item.total}个
                      </T>
                    </Box>
                  </Box>
                )}></CardHeader>
            </Card>
          })
        }
      </Box>
    </div>
  </Layout>
}

Page.getInitialProps = async ({ req }) => {
  const iconsets = await axios.get(`http://${req.headers.host}/api/iconsets/query`).then(res => res.data.data)
  return { cookie: req.headers.cookie, iconsets }
}

export default Page