const uuid = require("uuid").v4

class User {
  constructor(id, name, hash) {
    this.id = id || uuid()
    this.name = name
    this.hashedPassword = hash
  }
}

module.exports = User