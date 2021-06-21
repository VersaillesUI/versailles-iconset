import React from 'react'
import Modal from '@material-ui/core/Modal'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Input from '../components/input'
import { makeStyles } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import axios from 'axios'

const useStyles = makeStyles(theme => {
  return {
    form: {
      width: 300,
      textAlign: 'left'
    }
  }
})

export default function (props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [iconsetName, setIconsetName] = React.useState('')
  const [projectName, setProjectName] = React.useState('')
  const handleClose = () => {
    setOpen(false)
    setIconsetName('')
    setProjectName('')
  }
  const handleOpen = () => {
    setOpen(true)
  }
  const handleOk = () => {
    axios.post('/api/project/create', {
      iconsetName,
      projectName
    })
      .then(res => res.data)
      .then(res => {
        if (res.success) {
          handleClose()
          props.onSuccess && props.onSuccess()
        }
      })
  }
  const handleInputChange = (callback) => {
    return (evt) => {
      callback(evt.target.value)
    }
  }
  return <>
    <span onClick={handleOpen}>{props.children}</span>
    <Dialog open={open}>
      <DialogTitle>新建图标集</DialogTitle>
      <DialogContent>
        <div className={classes.form}>
          <Input value={projectName} onChange={handleInputChange(setProjectName)} fullWidth label="项目名称" />
        </div>
        <br />
        <div className={classes.form}>
          <Input value={iconsetName} onChange={handleInputChange(setIconsetName)} fullWidth label="图标集名称" />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          取消
        </Button>
        <Button onClick={handleOk} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  </>
}