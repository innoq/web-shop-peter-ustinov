/*
 * You would normally use a proper database to persist your entities. We are being lazy here: To avoid the
 * configuration overhead, we use an in-memory database that's hidden inside the Repository class.
 * (The term Repository is often used for an object that manages object creation and persistence.)
 *
 * We initialize the database on start-up from files on the disk. Change the json files in this directory if you
 * want to add or remove entities.
 */

const fs = require("fs").promises
const path = require("path")

const Cart = require("./../model/Cart")
const Product = require("./../model/Product")
const User = require("./../model/User")

class Repository {

  users = new Set()
  carts = new Map() // userId -> Cart
  products = new Map() // productId -> Product

  constructor() {
    this._initialize()
  }

  createUser(name, password) {
    const user = new User(null, name, password);
    this.users.add(user)
    return user
  }

  deleteUserById(userId) {
    this.users.delete(userId)
  }

  findUserById(userId) {
    for (let user of this.users) {
      if (user.id === userId) return user
    }
    return null
  }

  findUserByName(name) {
    for (let user of this.users) {
      if (user.name === name) return user
    }
    return null
  }

  findAllUsers() {
    return Array.from(this.users)
  }

  findProductById(productId) {
    return this.products.get(productId)
  }

  findProductsInCart(cart) {
    return new Map([...cart.items.keys()].map(id => [id, this.products.get(id)]))
  }

  findAllProducts() {
    return Array.from(this.products.values())
  }

  findCartByUserId(userId) {
    return this.carts.get(userId) || null
  }

  findOrCreateCartByUserId(userId) {
    let cart = this.findCartByUserId(userId)
    if (!cart) {
      cart = new Cart(userId)
      this.carts.set(userId, cart)
    }
    return cart
  }

  saveCart(cart) {
    this.carts.set(cart.userId, cart)
  }

  deleteCartByUserId(userId) {
    this.carts.delete(userId)
  }

  // Initialize the "database" from files on the disk on start-up.
  _initialize() {
    fs.readFile(path.join(__dirname, "products.json"))
      .then(buf => buf.toString())
      .then(json => JSON.parse(json))
      .then(ps => Array.from(ps).map(p => new Product(p.id, p.name, p.description, p.price)))
      .then(ps => ps.forEach(p => this.products.set(p.id, p)))
      .then(() => console.log(`initialized in-memory product database with ${this.products.size} entries`))
      .catch(err => console.log(err))

    fs.readFile(path.join(__dirname, "users.json"))
      .then(buf => buf.toString())
      .then(json => JSON.parse(json))
      .then(us => Array.from(us).map(u => new User(u.id, u.name, u.password)))
      .then(us => us.forEach(u => this.users.add(u)))
      .then(() => console.log(`initialized in-memory user database with ${this.users.size} entries`))
      .catch(err => console.log(err))
  }
}

module.exports = new Repository()