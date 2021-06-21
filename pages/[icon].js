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
import Info from '../src/components/Info'
import moment from 'moment'
import _ from 'lodash'
import clsx from 'clsx'
import Fab from '@material-ui/core/Fab'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Tooltip from '@material-ui/core/Tooltip'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import GetAppIcon from '@material-ui/icons/GetApp'
import { saveAs } from 'file-saver'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Layout from '../src/layout'
import SvgIcon from '../src/components/SvgIcon'

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
      flexBasis: 300,
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
      borderColor: 'transparent',
      transition: '0.2s',
      transitionProperty: 'borderColor, transform, box-shadow',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translate(0, -2px)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }
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
    selectedImageItem: {
      transform: 'translate(0, 0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    },
    title: {
      marginBottom: theme.spacing(1.5),
      display: 'block'
    }
  }
})

let uploadTasks = {
  total: 0,
  success: 0,
  error: 0
}

function Home (props) {
  const { cookie, iconsets, current } = props
  const classes = useStyles()
  const [project] = React.useState(current.data)
  const [projects, setProjects] = React.useState(iconsets.data || [])
  const [sourceType, setSourceType] = React.useState('react')
  const [iconsetName, setIconsetName] = React.useState(current.data.iconsetName)
  const [images, setImages] = React.useState([])
  const [width, setWidth] = React.useState(40)
  const [image, setImage] = React.useState(null)
  const [imageCopy, setImageCopy] = React.useState(null)
  const [alertData, setAlertData] = React.useState({ open: false })
  const [searchValue, setSearchValue] = React.useState('')

  useEffect(() => {
    if(project) {
      fetchImages()
    }
  }, [project])

  const fetchImages = () => {
    if(!project) return
    axios.get('/api/iconset/query?id=' + project.id)
      .then(res => res.data)
      .then(res => {
        setImages(res.data)
      })
      .catch(() => {
        setImages([])
      })
  }

  const handleUploadStart = () => {
    uploadTasks.total += 1
    setAlertData({
      open: true,
      message: '文件上传中...',
      autoClose: false
    })
  }

  const processUploadEnd = () => {
    if(uploadTasks.success + uploadTasks.error === uploadTasks.total) {
      setAlertData({
        open: true,
        message: `文件上传已完成，成功${uploadTasks.success}个，失败${uploadTasks.error}个，（如果上传的文件或文件名已存在，会标记为失败）`,
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
      images.splice(index, 1, res.data)
    } else {
      images.push(res.data)
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
    axios.delete(`/api/iconset/delete?id=${project.id}&file=${image.file}`)
      .then(res => res.data)
      .then(res => {
        if(res.success) {
          setAlertData({
            open: true,
            message: '删除成功'
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
          message: '删除失败'
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
    axios.get(`/api/parse/svg?id=${project.id}&fontName=${project.iconsetName}`, {
      responseType: 'blob'
    }).then(res => {
      saveAs(res.data, project.iconsetName + '.zip')
    }).catch(() => {
      setAlertData({
        open: true,
        message: '下载失败',
        type: 'error'
      })
    })
  }

  const handleRenameIconset = () => {
    if(iconsetName === project.iconsetName) {
      return
    }
    axios.post('/api/project/rename', {
      id: project.id,
      replace: iconsetName
    })
      .then(() => {
        setAlertData({
          open: true,
          message: '修改成功'
        })
      }).catch(() => {
        setIconsetName(project.iconsetName)
        setAlertData({
          open: true,
          message: '修改失败',
          type: 'error'
        })
      })
  }

  const handleChangeIconsetName = (evt) => {
    setIconsetName(evt.target.value)
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
      id: project.id,
      replace: image.fileName
    })
      .then(() => {
        setAlertData({
          open: true,
          message: '修改成功'
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
          message: '修改失败'
        })
      })
  }

  const projectId = project && project.id
  return (
    <Layout cookie={cookie} project={project} projects={projects}>
      <div className={classes.content}>
        <Box display="flex" alignItems="center" className={classes.actions}>
          <Paper elevation={2} className={classes.paper}>
            <InputBase
              className={classes.input}
              placeholder="搜索图标"
              onChange={handleSearchIcon}
              inputProps={{ 'aria-label': '搜索图标' }}
            />
            <Divider orientation="vertical" className={classes.divider} />
            <Box display="flex" alignItems="center">
              <Box padding={1.5} display="flex" alignItems="center">
                <Slider className={classes.slider} value={width} min={24} max={80} step={4} onChange={(evt, value) => setWidth(value)} />
                <T className={classes.sliderText} color="primary" variant="body2">{width}</T>
              </Box>
              <Box display="flex" alignItems="center">
                <Upload
                  onStart={handleUploadStart}
                  onError={handleUploadError}
                  onSuccess={handleUploadSuccess}
                  multiple
                  action={`/api/iconset/upload?id=${projectId}`}
                  accept="image/svg+xml">
                  <Tooltip title="上传到此图标库" aria-label="上传">
                    <IconButton color="primary">
                      <BackupIcon />
                    </IconButton>
                  </Tooltip>
                </Upload>
              </Box>
            </Box>
          </Paper>
          <Box flexGrow={1}></Box>
        </Box>
        <div className={classes.imageRoot}>
          {images && _.sortBy(images, 'file').filter(o => o.file.indexOf(searchValue) > -1).map(item => {
            const project = image && (item.file === image.file)
            return <Tooltip title={item.file} key={item.file}>
              <Paper onClick={handleClickImage(item)} variant="outlined" className={clsx([classes.imageItem, project && classes.selectedImageItem])}>
                <SvgIcon style={{
                  fontSize: width,
                  padding: width / 5
                }} className={classes.image} content={item.content} />
              </Paper>
            </Tooltip>
          })}
        </div>
      </div>
      {
        image ? <div className={classes.propertyPanel}>
          <TextField
            fullWidth
            label="文件命名"
            defaultValue=" "
            value={image && image.fileName}
            className={classes.textField}
            onChange={handleChangeImageName}
            onBlur={handleRenameImageName}
          />
          <Box>
            <T variant="body2" className={classes.title}>文件信息</T>
            <Box marginTop={-0.5}>
              <Info label="文件格式">{_.get(image, 'ext', '').replace(/^\./, '').toUpperCase()}</Info>
              <Info label="文件大小">{Math.round(_.get(image, 'stat.size', 0) / 1024 * 100) / 100}KB</Info>
              <Info label="修改时间">{moment(_.get(image, 'stat.ctime')).format('YYYY-MM-DD HH:mm')}</Info>
            </Box>
          </Box>
          <br />
          <Box flexGrow={1}>
            <T variant="body2" className={classes.title}>文件预览</T>
            <Paper variant="outlined" className={classes.previewItem} style={{ margin: 0 }}>
              <img style={{ padding: 25, width: 100, height: 100 }} src={`/api/iconset/image?id=${projectId}&file=${image.file}`} />
            </Paper>
          </Box>
          <br />
          <Box position="absolute" right={24} bottom={24} display="flex" alignItems="flex-end" flexDirection="column">
            <Tooltip title="收藏此图标" aria-label="收藏此图表库">
              <Fab>
                <FavoriteBorderIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="删除此文件">
              <Fab style={{ marginTop: 16 }} onClick={handleDelete}>
                <DeleteIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="返回上级">
              <Fab style={{ marginTop: 16 }} onClick={handleReturn}>
                <KeyboardReturnIcon />
              </Fab>
            </Tooltip>
          </Box>
        </div> : (
          !!project && <div className={classes.propertyPanel}>
            <TextField
              fullWidth
              label="图标集命名"
              defaultValue=" "
              value={iconsetName}
              className={classes.textField}
              onChange={handleChangeIconsetName}
              onBlur={handleRenameIconset}
            />
            <Box>
              <T variant="body2" className={classes.title}>文件信息</T>
              <Box marginTop={-0.5}>
                <Info label="项目名称">{project.projectName}</Info>
                <Info label="创建时间">{moment(project.createTime).format('YYYY年MM月DD日')}</Info>
                <Info label="图标数量">{images.length}</Info>
              </Box>
            </Box>
            <br />
            <Box>
              <T variant="body2" className={classes.title}>脚本资源文件</T>
              <RadioGroup value={sourceType} onChange={handleChangeSourceType}>
                <T style={{ color: '#666' }} variant="subtitle2">复制链接，并应用于&lt;script&gt;标签中</T>
                <Box display="flex">
                  <FormControlLabel value="react" control={<Radio size="small" color="primary" />} label="React" />
                  <FormControlLabel value="vue" control={<Radio size="small" color="primary" />} label="Vue" />
                </Box>
              </RadioGroup>
              <Paper elevation={0}>
                <Box fontFamily="Consolas" padding={1} style={{
                  background: `rgba(0, 0, 0, 0.06)`,
                  wordBreak: 'break-all'
                }}>
                  {process.browser && `${window.location.origin}/api/iconset/${project.iconsetName}.min.js?type=${sourceType}`}
                </Box>
              </Paper>
            </Box>
            <br />
            <Box position="absolute" right={24} bottom={24} display="flex" alignItems="flex-end" flexDirection="column">
              <Tooltip title="生成字体文件，下载并预览" aria-label="生成字体文件，下载并预览">
                <Fab onClick={handleGenerateIconFont}>
                  <GetAppIcon />
                </Fab>
              </Tooltip>
            </Box>
          </div>
        )
      }
      <Snackbar open={alertData.open} autoHideDuration={alertData.autoClose ? 3000 : null} onClose={handleCloseSnackbar}>
        <Alert severity={alertData.type || 'success'} onClose={handleCloseSnackbar}>
          {alertData.message}
        </Alert>
      </Snackbar>
    </Layout>
  )
}

Home.getInitialProps = async ({ req, query }) => {
  const icon = query.icon
  const iconsets = await axios.get(`http://${req.headers.host}/api/project/query`).then(res => res.data)
  const current = await axios.get(`http://${req.headers.host}/api/project/query?name=${icon}`).then(res => res.data)
  return { current, iconsets, cookie: req.headers.cookie }
}

export default Home