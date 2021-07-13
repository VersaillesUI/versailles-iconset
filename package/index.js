export class AuthMap extends Map {
  static instance = null
  static getInstance () {
    if (!AuthMap.instance) {
      AuthMap.instance = new Map()
    }
    return AuthMap.instance
  }
}

export class AllowMethod {
  constructor (req, res) {
    this.req = req
    this.res = res
  }
  reject (methods) {
    if (typeof methods === 'string') {
      methods = [methods]
    }
    if (methods.some(o => {
      return this.req.method.toLowerCase() === o.toLowerCase()
    })) {
      return this.res.status(405)
    }
  }
  isNot (methods) {
    if (typeof methods === 'string') {
      methods = [methods]
    }
    if (!methods.some(o => {
      return this.req.method.toLowerCase() === o.toLowerCase()
    })) {
      return this.res.status(405)
    }
  }
}