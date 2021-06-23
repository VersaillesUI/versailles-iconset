export class AuthMap extends Map {
  static instance = null
  static getInstance () {
    if (!AuthMap.instance) {
      AuthMap.instance = new Map()
    }
    return AuthMap.instance
  }
}