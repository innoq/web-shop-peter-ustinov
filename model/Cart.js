class Cart {
  constructor(userId) {
    this.userId = userId
    this.items = new Map()
  }

  add(productId, count = 1) {
    this.items.set(productId, (items.get(productId) || 0) + count)
    return this
  }

  remove(productId) {
    this.items.delete(productId)
    return this
  }
}

module.exports = Cart