import React from 'react'
import Container from '@material-ui/core/Container'
import Head from 'next/head'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import T from '@material-ui/core/Typography'
import axios from 'axios'
import Highlight, { defaultProps } from 'prism-react-renderer'

const webpackCode = `const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  resolve: {
    alias: {
      '@': path.resolve(process.cwd())
    }
  }
})`

const usageExample = ([item]) => `function Usage () {
  return <${item.fileName.replace(/-/, '_').replace(/^[a-z]/, match => match.toUpperCase())} />
}`

function Helper (props) {
  const { current, code, query, assets } = props
  const script = process.browser && `${window.location.origin}/api/script/${current.data.aliasName}.js?type=${query.type}`
  return <>
    <Head>
      <title>开发手册</title>
      <link rel="stylesheet" href="/prism-oka.css"></link>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/prism.min.js"></script>
    </Head>
    <div style={{ background: '#F6F7F8', height: '100vh', overflow: 'auto' }}>
      <Container maxWidth="md" style={{ padding: 16 }}>
        <Paper elevation={0} square>
          <Box padding={4}>
            <T variant="h5" gutterBottom>开发者帮助文档</T>
            <br />
            <T variant="h6" gutterBottom>1. 下载脚本文件</T>
            <Paper variant="outlined" elevation={0}>
              <Box padding={2}>
                <a>{script}</a>
              </Box>
            </Paper>
            <br />
            <T variant="h6" gutterBottom>2. 将下载后的资源文件放到项目中的第三方库文件夹下</T>
            <T variant="body1" gutterBottom>例如，将下载的脚本文件放到 src 下的 lib 文件夹， 修改 webpack.config.js</T>
            <Highlight code={webpackCode} {...defaultProps} language="js">
              {({ className, tokens, getLineProps, getTokenProps }) => {
                return <pre className={className}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token, key })
                        const { style, ..._tokenProps } = tokenProps
                        return <span {..._tokenProps} />
                      })}
                    </div>
                  ))}
                </pre>
              }}
            </Highlight>
            <br />
            <T variant="h6" gutterBottom>3. 引用声明的资源</T>
            <Highlight code={code} {...defaultProps} language="jsx">
              {({ className, tokens, getLineProps, getTokenProps }) => {
                return <pre className={className}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token, key })
                        const { style, ..._tokenProps } = tokenProps
                        return <span {..._tokenProps} />
                      })}
                    </div>
                  ))}
                </pre>
              }}
            </Highlight>
            <br />
            <T variant="h6" gutterBottom>4. 在项目中使用</T>
            <Highlight code={usageExample(assets.data)} {...defaultProps} language="jsx">
              {({ className, tokens, getLineProps, getTokenProps }) => {
                return <pre className={className}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token, key })
                        const { style, ..._tokenProps } = tokenProps
                        return <span {..._tokenProps} />
                      })}
                    </div>
                  ))}
                </pre>
              }}
            </Highlight>
          </Box>
        </Paper>
      </Container>
    </div>
  </>
}

Helper.getInitialProps = async (ctx) => {
  const current = await axios.get(`http://${ctx.req.headers.host}/api/iconsets/query?id=${ctx.query.id}`).then(res => res.data)
  const assets = await axios.get(`http://${ctx.req.headers.host}/api/iconset/query?id=${ctx.query.id}&limit=1`).then(res => res.data)
  const code = await axios.get(`http://${ctx.req.headers.host}/api/script/import?name=${current.data.aliasName}`).then(res => res.data)
  return {
    current,
    code,
    query: ctx.query,
    assets
  }
}

export default Helper