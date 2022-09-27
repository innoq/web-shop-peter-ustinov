const uuid = require("uuid").v4

class Product {
  constructor(id, name, description, price) {
    this.id = id || uuid()
    this.name = name
    this.description = description
    this.price = price
  }
}

module.exports = Product