import React from 'react'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import FormItem from '@/src/components/FormItem'
import Button from '@material-ui/core/Button'
import T from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import axios from 'axios'

export default function () {
  const [userName, setUserName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const handleLogin = () => {
    axios.post('/api/account/login?type=account', {
      userName,
      password
    })
      .then(res => res.data)
      .then(res => {
        if (res.success) {
          location.href = '/'
        }
      })
  }

  const handleChange = (set) => {
    return (evt) => {
      set(evt.target.value)
    }
  }

  return <Box width={320} margin="40px auto">
    <Box textAlign="center">
      <AccountCircleIcon style={{ fontSize: 80, padding: 10 }}></AccountCircleIcon>
    </Box>
    <Paper>
      <Box padding={3}>
        <div>
          <FormItem fullWidth label="邮箱或账号" value={userName} onChange={handleChange(setUserName)}></FormItem>
        </div>
        <br />
        <div>
          <FormItem fullWidth label="密码" type="password" value={password} onChange={handleChange(setPassword)}></FormItem>
        </div>
        <Box marginTop={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>登录</Button>
        </Box>
        <br />
        <Box textAlign="center">
          <Link>
            <T variant="outline">无法登录，寻找帮助？</T>
          </Link>
        </Box>
      </Box>
    </Paper>
    <Paper style={{ marginTop: 20 }}>
      <Box padding={1} textAlign="center">
        <Button href="/account/signup" fullWidth>创建账户</Button>
      </Box>
    </Paper>
  </Box>
}