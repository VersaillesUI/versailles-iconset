module.exports = {
  config: {
    api: {
      bodyParser: true
    }
  },
  async redirects () {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname
    }
    return config
  }
}