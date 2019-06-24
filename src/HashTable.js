export default class HashTable {
  constructor() {
    this.values = {}
  }

  calculateHash(key) {
    return JSON.stringify(key, Object.keys(key).sort())
  }

  set(key, value) {
    const hash = this.calculateHash(key)
    this.values[hash] = value
  }

  get(key) {
    const hash = this.calculateHash(key)
    return this.values[hash]
  }
}