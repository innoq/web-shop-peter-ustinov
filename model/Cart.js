class Cart {
  constructor(userId) {
    this.userId = userId
    this.items = new Map() // productId -> count
  }

  get itemCount() { return this.items.size }

  changeItemCountBy(productId, delta) {
    let newCount = (this.items.get(productId) || 0) + delta
    if (newCount > 0) {
      this.items.set(productId, newCount)
    } else {
      this.items.delete(productId)
    }
    return this
  }
}

module.exports = Cart