import React from 'react'
import FormItem from '../components/FormItem'
import { makeStyles } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'

const useStyles = makeStyles(() => {
  return {
    form: {
      width: 300,
      textAlign: 'left'
    },
    input: {
      paddingRight: 0
    }
  }
})

export default function (props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [iconsetName] = React.useState('')
  const [aliasName, setAliasName] = React.useState('')
  const [users, setUsers] = React.useState([])
  const [currentUsers, setCurrentUsers] = React.useState([])
  const [data, setData] = React.useState(null)
  const handleClose = () => {
    setOpen(false)
    setAliasName('')
  }
  const handleOpen = () => {
    setOpen(true)
  }
  const handleOk = () => {
    if(props.onOk) {
      props.onOk(data).then(() => {
        handleClose()
      })
    }
  }
  const handleInputChange = (callback) => {
    return (evt, data) => {
      callback(evt.target.value)
      setData(data)
    }
  }
  const fetchUsers = () => {
    axios.get('/api/account/users')
      .then(res => res.data)
      .then(res => {
        if(res.success) {
          setUsers(res.data)
        }
      })
  }
  const fetchCurrentUsers = () => {
    axios.get(`/api/iconset/users?id=${props.id}`)
      .then(res => res.data)
      .then(res => {
        if(res.success) {
          setCurrentUsers(res.data)
        }
      })
  }
  React.useEffect(() => {
    if(open) {
      setTimeout(() => {
        fetchUsers()
        fetchCurrentUsers()
      })
    }
  }, [open])
  return <>
    <span onClick={handleOpen}>{props.children}</span>
    <Dialog open={open}>
      <DialogTitle>添加子用户权限</DialogTitle>
      <DialogContent>
        <div className={classes.form}>
          <Autocomplete
            getOptionLabel={(option) => option.userName}
            getOptionDisabled={(option) => {
              return currentUsers.some(o => o.userId === option.id) || Number(props.iconset.userId) === option.id
            }}
            options={users}
            onChange={handleInputChange(setAliasName)}
            renderInput={params => {
              return <TextField
                value={aliasName}
                fullWidth
                label="选择权限关联用户"
                {...params} />
            }} />
        </div>
        <br />
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