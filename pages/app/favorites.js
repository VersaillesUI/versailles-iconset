import React from 'react'
import Layout from '@/src/layout'

function Page (props) {
  return <Layout cookie={props.cookie} iconset="favorites">

  </Layout>
}

Page.getInitialProps = async ({ req }) => {
  return { cookie: req.headers.cookie }
}

export default Page