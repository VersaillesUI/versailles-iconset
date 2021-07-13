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
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

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
      width: 400,
      margin: theme.spacing(1),
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
    image: {
      background: '#eee'
    },
    cardHeader: {
      padding: theme.spacing(1, 3, 1.5)
    },
    cardContent: {
      width: '100%',
      padding: '8px!important',
      flexGrow: 1
    }
  }
})

function Page (props) {
  const { displayingSets: _displayingSets } = props.appData
  const classes = useStyles()
  const [icons, setIcons] = React.useState([])
  const [displayingSets, setDisplayingSets] = React.useState(_displayingSets.filter(o => o.total))

  const fetchItem = async (item) => {
    return axios.get(`/api/iconset/query?id=${item.id}&limit=12`).then(res => res.data.data)
  }

  React.useEffect(() => {
    const result = []
    if(Array.isArray(displayingSets)) {
      Promise.all(
        displayingSets.map((item, index) => {
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
  }, [displayingSets])

  const handleCreated = (data) => {
    setIconsets(data)
    setDisplayingSets(data.filter(o => o.total))
  }

  return <Layout onCreated={handleCreated} appData={{
    ...props.appData,
    target: 'illustrations'
  }}>
    <div className={classes.content}>
      <Box display="flex" flexWrap="wrap" height="auto">
        {
          Array.isArray(displayingSets) && displayingSets.map((item, index) => {
            const nicons = icons[index]
            return <Card onClick={() => location.href = `/illustrations/view/${item.id}`} className={classes.card} key={item.id || index}>
              <CardContent className={classes.cardContent}>
                <GridList spacing={6} cellHeight={150}>
                  {
                    Array.apply(this, { length: 4 }).map((_, next) => {
                      const image = nicons && nicons[next]
                      return <GridListTile key={(image && image.file) || next}>
                        {
                          image && <img className={classes.image} src={`/api/iconset/image?id=${item.id}&file=${image.file}`}></img>
                        }
                      </GridListTile>
                    })
                  }
                </GridList>
              </CardContent>
              <CardHeader
                className={classes.cardHeader}
                title={(
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1} display="flex" alignItems="center">
                      <AccountCircleIcon />
                      &nbsp;
                      <T variant="body1">{item.iconsetName}</T>
                    </Box>
                    <Box display="flex" alignItems="center">
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

Page.getInitialProps = async (ctx) => {
  const { req } = ctx
  const iconsets = await axios.get(`http://${req.headers.host}/api/iconsets/all?font=0`).then(res => res.data.data)
  const cookie = req.headers.cookie

  if(Page.getNextProps) {
    const props = await Page.getNextProps(ctx)
    return {
      appData: {
        iconsets,
        cookie,
        nav: Page.nav,
        ...props
      }
    }
  }

  return {
    appData: {
      iconsets,
      cookie,
      displayingSets: iconsets,
      nav: 'all'
    }
  }
}

export default Page