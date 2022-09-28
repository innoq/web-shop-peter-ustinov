const repository = require("./../persistence/repository")
const sessionUtils =require("./session-utils")

const shopController = {

  getProduct: (req, res) => {
    const { productId } = req.params
    const product = repository.findProductById(productId)
    if (product) {
      const viewModel = {
        ...sessionUtils.generateBaseViewModelFromSession(req.session),
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.toFixed(2)
        },
      }
      sessionUtils.clearSessionForNextRequest(req.session)
      res.render("product", viewModel)
    } else {
      res.status(404).send("product not found")
    }
  },

  getProducts: (req, res) => {
    const products = repository.findAllProducts()
    const viewModel = {
      ...sessionUtils.generateBaseViewModelFromSession(req.session),
      products: products.map(product => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.toFixed(2),
        }
      })
    }
    return res.render("products", viewModel)
  },

  getCart: (req, res) => {
    if (!req.session.user) {
      req.session.message = "Um Ihren Warenkorb einzusehen, müssen Sie sich anmelden."
      req.session.intendedRoute = "/cart" // save destination for redirect after login
      return res.redirect("/login")
    }

    const viewModel = sessionUtils.generateBaseViewModelFromSession(req.session)
    const cart = repository.findCartByUserId(req.session.user.id)
    if (cart) {
      const productsInCart = repository.findProductsInCart(cart)
      const items = []
      let total = 0.0
      for (const [productId, count] of cart.items) {
        const product = productsInCart.get(productId)
        items.push({
          count: count,
          productId: product.id,
          productName: product.name,
          singlePrice: product.price.toFixed(2),
          totalPrice: (count * product.price).toFixed(2),
        })
        total = total + count * product.price
      }
      viewModel.cart.items = items
      viewModel.cart.total = total.toFixed(2)
    }

    sessionUtils.clearSessionForNextRequest(req.session)
    res.render("cart", viewModel)
  },

  postCart: (req, res) => {
    if (!req.session.user) {
      req.session.message = "Bitte melden Sie sich zuerst an, um einzukaufen."
      req.session.intendedRoute = `/product/${req.body.productId}` // save route for redirect after login
      return res.redirect("/login")
    }

    const productId = req.body.productId
    const count = Number.parseInt(req.body.count)

    let cart = repository.findOrCreateCartByUserId(req.session.user.id)
    cart = cart.changeItemCountBy(productId, count)
    if (cart.items.size > 0) {
      repository.saveCart(cart)
      if (!req.session.cart) req.session.cart = { id: cart.id }
    } else {
      repository.deleteCartByUserId(req.session.user.id)
    }

    res.redirect("/cart")
  },
}

module.exports = shopController