import React from 'react'
import FormItem from '../components/FormItem'
import { makeStyles } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
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
  const [aliasName, setAliasName] = React.useState('')
  const [isFont, setIsFont] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
    setIconsetName('')
    setAliasName('')
  }
  const handleOpen = () => {
    setOpen(true)
  }
  const handleOk = () => {
    if (props.onCreate) {
      props.onCreate({
        iconsetName, aliasName, isFont
      }).then(() => {
        handleClose()
      })
    }
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
          <FormItem value={iconsetName} onChange={handleInputChange(setIconsetName)} fullWidth label="图标库名" />
        </div>
        <br />
        <div className={classes.form}>
          <FormItem value={aliasName} onChange={handleInputChange(setAliasName)} fullWidth label="图表库别名（仅限英文）" />
        </div>
        <br />
        <div className={classes.form}>
          <FormItem direction="hoz" label="是否为字体库">
            <Switch value={isFont} onChange={handleInputChange(setIsFont)}></Switch>
          </FormItem>
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