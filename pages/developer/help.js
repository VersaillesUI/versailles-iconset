import React from 'react'
import Container from '@material-ui/core/Container'
import Head from 'next/head'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import T from '@material-ui/core/Typography'
import axios from 'axios'
import Highlight, { defaultProps } from 'prism-react-renderer'

const WEBPACK_CODE = `const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  resolve: {
    alias: {
      '@': path.resolve(process.cwd())
    }
  }
})`

const REACT_USAGE_EXAMPLE = (data, [item]) => {
  const name = item.fileName.replace(/-/g, '_').replace(/^[a-z]/, match => match.toUpperCase())
  return `import { ${name} } from '@/src/lib/${data.aliasName}'\r\n\r\nfunction Usage () {\r\n  return <${name} />\r\n}`
}

const VUE2_USAGE_EXAMPLE = (data, [item]) => {
  const name = item.fileName
  return `<template>\r\n  <div>\r\n    <${data.aliasName}-icon type="${name}" />\r\n  </div>\r\n</template>`
}

function Helper (props) {
  const { current, code, query, assets } = props
  const script = process.browser && `${window.location.origin}/api/script/${current.data.aliasName}.js?type=${query.type}`
  const usage = {
    vue2: VUE2_USAGE_EXAMPLE,
    react: REACT_USAGE_EXAMPLE
  }[query.type]
  return <>
    <Head>
      <title>开发者帮助文档</title>
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
            <Paper style={{
              backgroundColor: '#F4F5F6'
            }} elevation={0}>
              <Box padding={2}>
                <a href={script} target="_blank">{script}</a>
              </Box>
            </Paper>
            <br />
            <T variant="h6" gutterBottom>2. 将下载后的资源文件放到项目中的第三方库文件夹下</T>
            <T variant="body1" gutterBottom>例如，将下载的脚本文件放到 src 下的 lib 文件夹， 修改 webpack.config.js</T>
            <Highlight code={WEBPACK_CODE} {...defaultProps} language="js">
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
            <T variant="h6" gutterBottom>3. 按需引用需要依赖的资源（当前展示为全部资源）</T>
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
            <Highlight code={usage(current.data, assets.data)} {...defaultProps} language={query.type !== 'react' ? 'html' : 'jsx'}>
              {({ className, tokens, getLineProps, getTokenProps }) => {
                return <pre className={className}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token, key })
                        const { style, ..._tokenProps } = tokenProps
                        return <span style={query.type !== 'react' && style} {..._tokenProps} />
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
  const { query } = ctx
  const current = await axios.get(`http://${ctx.req.headers.host}/api/iconsets/query?id=${ctx.query.id}`).then(res => res.data)
  const assets = await axios.get(`http://${ctx.req.headers.host}/api/iconset/query?id=${ctx.query.id}&limit=1`).then(res => res.data)
  const code = await axios.get(`http://${ctx.req.headers.host}/api/script/import?name=${current.data.aliasName}&type=${query.type}`).then(res => res.data)
  return {
    current,
    code,
    query: ctx.query,
    assets
  }
}

export default Helper