import React, { useEffect } from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'
import T from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'
import BackupIcon from '@material-ui/icons/Backup'
import Upload from 'rc-upload'
import Slider from '@material-ui/core/Slider'
import Divider from '@material-ui/core/Divider'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Info from '@/src/components/Info'
import moment from 'moment'
import _ from 'lodash'
import clsx from 'clsx'
import Fab from '@material-ui/core/Fab'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Tooltip from '@material-ui/core/Tooltip'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import GetAppIcon from '@material-ui/icons/GetApp'
import { saveAs } from 'file-saver'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Layout from '@/src/layout'
import SvgIcon from '@/src/components/SvgIcon'
import Badge from '@material-ui/core/Badge'
import PaletteIcon from '@material-ui/icons/Palette'
import Popover from '@material-ui/core/Popover'
import { SketchPicker } from 'react-color'
import Link from '@material-ui/core/Link'
import Cookie from 'cookie'
import Cookies from 'cookies'
import SettingsIcon from '@material-ui/icons/Settings'

const useStyles = makeStyles((theme) => {
  return {
    content: {
      position: 'relative',
      flexGrow: 1,
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${theme.palette.grey[200]}`
    },
    propertyPanel: {
      flexBasis: 320,
      flexShrink: 0,
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      padding: theme.spacing(3),
      overflow: 'hidden'
    },
    iconButton: {
      padding: 10,
      fontSize: 16
    },
    input: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(0.25),
      marginRight: theme.spacing(2),
      flex: 1
    },
    paper: {
      display: 'flex',
      alignItems: 'center',
      width: 600
    },
    addBtn: {
      textAlign: 'left',
      padding: theme.spacing(2.5)
    },
    imageRoot: {
      flexGrow: 1,
      overflow: 'auto',
      padding: theme.spacing(12, 3, 3)
    },
    imageItem: {
      margin: theme.spacing(1),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(0, 0, 0, 0.03)',
      transition: '0.2s',
      transitionProperty: 'borderColor, transform, box-shadow',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translate(0, -2px)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        borderColor: 'rgba(0, 0, 0, 0)'
      }
    },
    selectedImageItem: {
      transform: 'translate(0, 0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    image: {
      margin: theme.spacing(2)
    },
    previewItem: {
      display: 'inline-block',
      fontSize: 0,
      borderWidth: 2,
      borderColor: theme.palette.grey[200]
    },
    textField: {
      marginBottom: theme.spacing(3)
    },
    slider: {
      width: 140,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(0)
    },
    actions: {
      position: 'absolute',
      padding: theme.spacing(3, 4),
      left: 0,
      top: 0,
      right: 0
    },
    divider: {
      minHeight: 24,
      margin: theme.spacing(0, 0.5)
    },
    title: {
      marginBottom: theme.spacing(1.5),
      display: 'block',
      flexGrow: 1
    }
  }
})

let uploadTasks = {
  total: 0,
  success: 0,
  error: 0
}

const defaultColor = '#000'

function Home (props) {
  const { cookie, current, iconsets } = props
  const classes = useStyles()
  const [cookies] = React.useState(Cookie.parse(cookie || ''))
  const [iconset, setIconset] = React.useState(current)
  const [sourceType, setSourceType] = React.useState('react')
  const [aliasName, setAliasName] = React.useState(current.aliasName)
  const [images, setImages] = React.useState([])
  const [width, setWidth] = React.useState(iconset.isFontset ? 40 : 200)
  const [minWidth] = React.useState(iconset.isFontset ? 20 : 120)
  const [maxWidth] = React.useState(iconset.isFontset ? 80 : 240)
  const [step] = React.useState(iconset.isFontset ? 4 : 10)
  const [image, setImage] = React.useState(null)
  const [imageCopy, setImageCopy] = React.useState(null)
  const [alertData, setAlertData] = React.useState({ open: false })
  const [searchValue, setSearchValue] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showPalette, setShowPalette] = React.useState(false)
  const [color, setColor] = React.useState((process.browser && sessionStorage.getItem('color')) || defaultColor)
  const [downloading, setDownloading] = React.useState(false)
  const [isOwner] = React.useState(iconset.userId === cookies.userId)

  useEffect(() => {
    if(iconset) {
      fetchImages()
    }
  }, [iconset])

  const fetchImages = () => {
    if(!iconset) return
    axios.get('/api/iconset/query?id=' + iconset.id)
      .then(res => res.data)
      .then(res => {
        setImages(res.data)
      })
      .catch(() => {
        setImages([])
      })
  }

  const fetchCurrentIconsetInfo = () => {
    axios.get(`/api/iconsets/${iconset.id}`)
      .then(res => res.data)
      .then(res => {
        setIconset(res.data)
      })
  }

  const handleUploadStart = () => {
    uploadTasks.total += 1
    setAlertData({
      open: true,
      message: '???????????????...',
      autoClose: false
    })
  }

  const processUploadEnd = () => {
    if(uploadTasks.success + uploadTasks.error === uploadTasks.total) {
      setAlertData({
        open: true,
        message: `??????????????????????????????${uploadTasks.success}????????????${uploadTasks.error}???`,
        type: 'info',
        autoClose: true
      })

      uploadTasks = {
        total: 0,
        error: 0,
        success: 0
      }
    }
  }

  const handleUploadError = () => {
    uploadTasks.error += 1
    processUploadEnd()
  }

  const handleUploadSuccess = (res) => {
    uploadTasks.success += 1
    const index = images.findIndex(o => o.file === res.data.file)
    if(index > -1) {
      images.splice(index, 1, {
        ...res.data,
        isNew: true
      })
    } else {
      images.push({
        ...res.data,
        isNew: true
      })
    }
    setImages([...images])
    processUploadEnd()
  }

  const handleCloseSnackbar = () => {
    setAlertData({
      open: false
    })
  }

  const handleDelete = () => {
    axios.delete(`/api/iconset/delete?id=${iconset.id}&file=${image.file}`)
      .then(res => res.data)
      .then(res => {
        if(res.success) {
          setAlertData({
            open: true,
            message: '????????????'
          })
          const imageIndex = images.findIndex(o => o.file === image.file)
          images.splice(imageIndex, 1)
          setImages([...images])
          if(images.length > 0) {
            if(imageIndex < images.length - 1) {
              setImage(images[imageIndex])
            } else {
              setImage(images[imageIndex - 1])
            }
          }
        }
      }).catch(() => {
        setAlertData({
          open: true,
          type: 'error',
          message: '????????????'
        })
      })
  }

  const handleClickImage = (image) => {
    return () => {
      setImage(image)
      setImageCopy({ ...image })
    }
  }

  const handleChangeImageName = (evt) => {
    const name = evt.target.value
    if(image.fileName === name) {
      return
    }
    setImage({
      ...image,
      fileName: name
    })
  }

  const handleReturn = () => {
    setImage(null)
  }

  const handleGenerateIconFont = () => {
    if(downloading) {
      return
    }
    setDownloading(true)
    axios.get(`/api/parse/svg?id=${iconset.id}&fontName=${iconset.aliasName}`, {
      responseType: 'blob'
    }).then(res => {
      saveAs(res.data, iconset.iconsetName + '.zip')
    }).catch(() => {
      setAlertData({
        open: true,
        message: '????????????',
        type: 'error'
      })
    }).finally(() => {
      setDownloading(false)
    })
  }

  const handleRenameIconset = () => {
    if(aliasName === iconset.aliasName) {
      return
    }
    axios.post('/api/iconset/rename', {
      id: iconset.id,
      replace: aliasName
    })
      .then(() => {
        setAlertData({
          open: true,
          message: '????????????'
        })
      }).catch(() => {
        setAliasName(iconset.aliasName)
        setAlertData({
          open: true,
          message: '????????????',
          type: 'error'
        })
      })
  }

  const handleChangeIconsetName = (evt) => {
    setAliasName(evt.target.value)
  }

  const handleSearchIcon = (evt) => {
    setSearchValue(evt.target.value)
  }

  const handleChangeSourceType = (evt) => {
    setSourceType(evt.target.value)
  }

  const handleRenameImageName = () => {
    const ext = image.ext
    if(image.fileName === image.file.replace(/\.[0-9a-z_-]*$/, '')) {
      return
    }
    if(!image.fileName) {
      setImage({ ...imageCopy })
      return
    }
    axios.post('/api/iconset/rename', {
      id: iconset.id,
      file: image.file,
      replace: image.fileName
    })
      .then(() => {
        setAlertData({
          open: true,
          message: '????????????'
        })
        const imageIndex = images.findIndex(o => o.file === image.file)
        const imageData = {
          ...image,
          file: image.fileName + ext
        }
        setImage(imageData)
        if(imageIndex > -1) {
          images[imageIndex] = imageData
          setImages([...images])
        }
      })
      .catch(() => {
        setAlertData({
          open: true,
          message: '????????????'
        })
      })
  }

  const handleShowPalette = (evt) => {
    setAnchorEl(evt.currentTarget)
    setShowPalette(true)
  }

  const handleClosePalette = () => {
    setShowPalette(false)
  }

  const handleSetColor = (color) => {
    setColor(color.hex)
    sessionStorage.setItem('color', color.hex)
  }

  const handleFavorite = () => {
    if(iconset.favorited) {
      axios.post('/api/iconset/unfavorite', {
        iconsetId: iconset.id
      })
        .then(() => {
          setAlertData({
            open: true,
            message: '??????????????????'
          })
          fetchCurrentIconsetInfo()
        })
        .catch(() => {
          setAlertData({
            open: true,
            type: 'error',
            message: '??????????????????'
          })
        })
    } else {
      axios.post('/api/iconset/favorite', {
        iconsetId: iconset.id
      })
        .then(() => {
          setAlertData({
            open: true,
            message: '????????????'
          })
          fetchCurrentIconsetInfo()
        })
        .catch(() => {
          setAlertData({
            open: true,
            type: 'error',
            message: '????????????'
          })
        })
    }
  }

  const handleDeleteIconset = () => {
    axios.delete(`/api/iconsets/delete?id=${iconset.id}`)
      .then(() => {
        setAlertData({
          open: true,
          message: '??????????????????????????????...'
        })
        setTimeout(() => {
          location.href = '/app'
        }, 3000)
      })
      .catch(() => {
        setAlertData({
          open: true,
          type: 'error',
          message: '????????????'
        })
      })
  }

  const iconsetId = iconset && iconset.id
  const downloadUrl = iconset && process.browser && `${window.location.origin}/api/script/${iconset.aliasName}.js?type=${sourceType}`
  return (
    <Layout appData={{
      cookie: cookie,
      iconset: iconset,
      iconsets: iconsets,
      target: 'illustrations'
    }}>
      <div className={classes.content}>
        <Box display="flex" alignItems="center" className={classes.actions}>
          <Paper elevation={2} className={classes.paper}>
            <InputBase
              className={classes.input}
              placeholder="????????????"
              onChange={handleSearchIcon}
              inputProps={{ 'aria-label': '????????????' }}
            />
            <Divider orientation="vertical" className={classes.divider} />
            <Box display="flex" alignItems="center">
              <Box padding={1.5} display="flex" alignItems="center">
                <Slider className={classes.slider} value={width} min={minWidth} max={maxWidth} step={step} onChange={(evt, value) => setWidth(value)} />
                <T className={classes.sliderText} color="primary" variant="body2">{width}</T>
              </Box>
              <Box display="flex" alignItems="center" paddingRight={1}>
                {
                  !!iconset.isFontset && <IconButton onClick={handleShowPalette} color="primary">
                    <PaletteIcon />
                  </IconButton>
                }
                {
                  isOwner && <Upload
                    onStart={handleUploadStart}
                    onError={handleUploadError}
                    onSuccess={handleUploadSuccess}
                    multiple
                    action={`/api/iconset/upload?id=${iconsetId}&font=${iconset.isFontset}`}
                    accept={iconset.isFontset ? 'image/svg+xml' : 'image/svg+xml, image/png, image/jpg, image/bmp, image/gif'}>
                    <Tooltip title="?????????????????????" aria-label="??????">
                      <IconButton color="primary">
                        <BackupIcon />
                      </IconButton>
                    </Tooltip>
                  </Upload>
                }
              </Box>
            </Box>
          </Paper>
          <Box flexGrow={1}></Box>
        </Box>
        <div className={classes.imageRoot}>
          {images && _.sortBy(images, 'file').filter(o => o.file.indexOf(searchValue) > -1).map(item => {

            const display = iconset.isFontset ? <SvgIcon style={{
              fontSize: width,
              padding: width / 5,
              color
            }} className={classes.image} content={item.content} /> : <div style={{
              width: width,
              height: width
            }}>
              <img style={{ padding: width / 10 }} width={width} src={`/api/iconset/image?id=${iconset.id}&file=${item.file}`} />
            </div>

            const selected = image && item.file === image.file

            return <Tooltip title={item.file} key={item.file}>
              {
                item.isNew ?
                  <Paper onClick={handleClickImage(item)} variant="outlined" className={clsx([classes.imageItem, selected && classes.selectedImageItem])}>
                    <Badge anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                      badgeContent="new"
                      color="secondary"
                      component="div">
                      {display}
                    </Badge>
                  </Paper>
                  : <Paper onClick={handleClickImage(item)} variant="outlined" className={clsx([classes.imageItem, selected && classes.selectedImageItem])}>
                    {display}
                  </Paper>
              }
            </Tooltip>
          })}
        </div>
      </div>
      {
        image ? <div className={classes.propertyPanel}>
          <TextField
            fullWidth
            label="????????????"
            defaultValue=" "
            value={image && image.fileName}
            className={classes.textField}
            onChange={handleChangeImageName}
            onBlur={handleRenameImageName}
          />
          <Box>
            <T variant="body2" className={classes.title}>????????????</T>
            <Box marginTop={-0.5}>
              <Info label="????????????">{_.get(image, 'ext', '').replace(/^\./, '').toUpperCase()}</Info>
              <Info label="????????????">{Math.round(_.get(image, 'stat.size', 0) / 1024 * 100) / 100}KB</Info>
              <Info label="????????????">{moment(_.get(image, 'stat.ctime')).format('YYYY-MM-DD HH:mm')}</Info>
            </Box>
            <br />
          </Box>
          <Box position="absolute" right={24} bottom={24} display="flex" alignItems="flex-end" flexDirection="column">
            {
              isOwner && <Tooltip title="???????????????">
                <Fab style={{ marginTop: 16 }} onClick={handleDelete}>
                  <DeleteIcon />
                </Fab>
              </Tooltip>
            }
            <Tooltip title="????????????">
              <Fab style={{ marginTop: 16 }} onClick={handleReturn}>
                <KeyboardReturnIcon />
              </Fab>
            </Tooltip>
          </Box>
        </div> : (
          !!iconset && <div className={classes.propertyPanel}>
            <TextField
              fullWidth
              label="???????????????"
              defaultValue=" "
              value={aliasName}
              className={classes.textField}
              onChange={handleChangeIconsetName}
              onBlur={handleRenameIconset}
            />
            <Box>
              <T variant="body2" className={classes.title}>????????????</T>
              <Box marginTop={-0.5}>
                <Info label="????????????">{iconset.iconsetName}</Info>
                <Info label="????????????">{moment(iconset.createTime).format('YYYY???MM???DD???')}</Info>
                <Info label="????????????">{images.length}</Info>
                <Info label="?????????">{iconset.isFontset ? '?????????' : '?????????'}</Info>
              </Box>
            </Box>
            <br />
            <Box>
              <Box display="flex" marginBottom={1.5} alignItems="center">
                <T variant="body2" style={{ flexGrow: 1 }}>??????????????????</T>
                <Link target="_blank" href={`/developer/help?id=${iconset.id}&type=${sourceType}`}>
                  <T style={{ color: '#666' }} variant="body2">????????????</T>
                </Link>
              </Box>
              <RadioGroup size="small" value={sourceType} onChange={handleChangeSourceType}>
                <Box display="flex">
                  <FormControlLabel value="react" control={<Radio size="small" color="primary" />} label="REACT" />
                  <FormControlLabel value="vue2" control={<Radio size="small" color="primary" />} label="VUE@2" />
                </Box>
              </RadioGroup>
              <a target="_blank" href={downloadUrl}><Paper elevation={0}>
                <Box fontFamily="Consolas" padding={1.5} style={{
                  background: `rgba(0, 0, 0, 0.03)`,
                  wordBreak: 'break-all'
                }}>
                  {downloadUrl}
                </Box>
              </Paper>
              </a>
            </Box>
            <br />
            <Box position="absolute" right={24} bottom={24} display="flex" alignItems="flex-end" flexDirection="column">
              {
                !isOwner && <Tooltip title="??????????????????" aria-label="??????????????????">
                  <Fab onClick={handleFavorite}>
                    {
                      iconset.favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />
                    }
                  </Fab>
                </Tooltip>
              }
              {
                isOwner && <Tooltip title="????????????" aria-label="????????????">
                  <Fab href={`/illustrations/view/settings?id=${iconset.id}`}>
                    <SettingsIcon />
                  </Fab>
                </Tooltip>
              }
              {
                isOwner && <Tooltip title="??????????????????" aria-label="??????????????????">
                  <Fab onClick={handleDeleteIconset} style={{ marginTop: 16 }}>
                    <DeleteIcon />
                  </Fab>
                </Tooltip>
              }
              {
                !!iconset.isFontset && <Tooltip title="????????????????????????????????????" aria-label="????????????????????????????????????">
                  <Fab onClick={handleGenerateIconFont} style={{ marginTop: 16 }}>
                    <GetAppIcon />
                  </Fab>
                </Tooltip>
              }
            </Box>
          </div>
        )
      }
      <Snackbar open={alertData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={alertData.type || 'success'} onClose={handleCloseSnackbar}>
          {alertData.message}
        </Alert>
      </Snackbar>
      <Popover
        anchorEl={anchorEl}
        open={showPalette}
        onClose={handleClosePalette}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SketchPicker color={color} onChange={handleSetColor} />
      </Popover>
    </Layout>
  )
}

Home.getInitialProps = async ({ req, res, query }) => {
  const iconsetId = query.id
  const cookies = new Cookies(req, res)
  const userId = cookies.get('userId') || ''
  const iconsets = await axios.get(`http://${req.headers.host}/api/iconsets/all?font=0`).then(res => res.data.data)
  const current = await axios.get(`http://${req.headers.host}/api/iconsets/${iconsetId}?userId=${userId}`).then(res => res.data.data)
  return { current, cookie: req.headers.cookie, iconsets }
}

export default Home