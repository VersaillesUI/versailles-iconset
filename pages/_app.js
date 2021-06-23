import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Head from 'next/head'
import theme from '@/src/theme'
import '@/styles/globals.css'

function isIE () {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('msie') > -1 || ua.indexOf('trident') > -1
}

function App ({ Component, pageProps }) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if(jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return <ThemeProvider theme={theme}>
    <Head>
      <title>
        {process.browser && isIE() ? 'IE is dead' : '华宇图标库'}
      </title>
    </Head>
    <CssBaseline />
    {
      (process.browser && isIE()) ? <div className="no-ie">
        <img src="/ie-is-dead.png"></img>
      </div> :
        <Component {...pageProps} />
    }
  </ThemeProvider>
}

export default App
