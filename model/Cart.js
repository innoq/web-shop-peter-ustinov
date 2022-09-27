class Cart {
  constructor(userId) {
    this.userId = userId
    this.items = new Map() // productId -> count
  }

  changeItemCount(productId, count) {
    let newCount = (this.items.get(productId) || 0) + count
    if (newCount !== 0) {
      this.items.set(productId, newCount)
    } else {
      this.items.delete(productId)
    }
    return this
  }
}

module.exports = Cart