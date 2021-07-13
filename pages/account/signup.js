import React from 'react'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import FormItem from '@/src/components/FormItem'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

export default function () {
  const [userName, setUserName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [userNameError, setUserNameError] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('')
  const [alertData, setAlertData] = React.useState({
    open: false
  })

  const handleSignup = () => {
    let hasError = false
    if(!userName) {
      setUserNameError('请输入用户名')
      hasError = true
    }
    if(!email) {
      setEmailError('请输入邮箱地址')
      hasError = true
    }
    if(!password) {
      setPasswordError('请输入密码')
      hasError = true
    }
    if(!confirmPassword) {
      setConfirmPasswordError('请输入确认密码')
      hasError = true
    }
    if(password !== confirmPassword) {
      setConfirmPasswordError('确认密码与新密码不一致')
      hasError = true
    }
    if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
      setEmailError('邮箱地址格式输入不正确')
      hasError = true
    }
    if(password.length < 6) {
      setPasswordError('密码长度不能少于6位')
      hasError = true
    }
    if(hasError) {
      return
    }
    axios.post('/api/account/create', {
      userName,
      email,
      password
    })
      .then(res => res.data)
      .then(res => {
        if(res.success) {
          location.href = '/account/login'
        }
      })
      .catch(() => {
        setAlertData({
          open: true,
          message: '注册失败',
          type: 'error'
        })
      })
  }

  const handleChange = (set) => {
    return (evt) => {
      set(evt.target.value)
    }
  }

  const handleCloseSnackbar = () => {
    setAlertData({
      open: false
    })
  }

  return <Box width={320} margin="40px auto">
    <Box textAlign="center">
      <AccountCircleIcon style={{ fontSize: 80, padding: 10 }}></AccountCircleIcon>
    </Box>
    <Paper>
      <Box padding={3}>
        <div>
          <FormItem error={userNameError} fullWidth label="用户名" value={userName} onChange={handleChange(setUserName)}></FormItem>
        </div>
        <br />
        <div>
          <FormItem error={emailError} fullWidth label="邮箱地址" value={email} onChange={handleChange(setEmail)}></FormItem>
        </div>
        <br />
        <div>
          <FormItem error={passwordError} fullWidth label="密码" type="password" value={password} onChange={handleChange(setPassword)}></FormItem>
        </div>
        <br />
        <div>
          <FormItem error={confirmPasswordError} fullWidth label="确认密码" type="password" value={confirmPassword} onChange={handleChange(setConfirmPassword)}></FormItem>
        </div>
        <Box marginTop={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSignup}>注册</Button>
        </Box>
        <br />
      </Box>
    </Paper>
    <Paper style={{ marginTop: 20 }}>
      <Box padding={1} textAlign="center">
        <Button href="/account/login" fullWidth>已存在账户，立刻登录</Button>
      </Box>
    </Paper>
    <Snackbar open={alertData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
      <Alert severity={alertData.type || 'success'} onClose={handleCloseSnackbar}>
        {alertData.message}
      </Alert>
    </Snackbar>
  </Box>
}