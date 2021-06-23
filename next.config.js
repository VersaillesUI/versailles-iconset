module.exports = {
  config: {
    api: {
      bodyParser: true
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname
    }
    return config
  }
}