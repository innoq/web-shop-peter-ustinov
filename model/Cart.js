class Cart {
  constructor(userId) {
    this.userId = userId
    this.items = new Map() // productId -> count
  }

  addProduct(productId, count = 1) {
    this.items.set(productId, (this.items.get(productId) || 0) + count)
    return this
  }

  removeProduct(productId) {
    this.items.delete(productId)
    return this
  }
}

module.exports = Cart