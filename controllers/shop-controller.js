const repository = require("./../persistence/repository")

const shopController = {

  getProduct: (req, res) => {
    const { productId } = req.params
    const product = repository.findProductById(productId)
    if (product) {
      res.render("product", {
        title: product.name,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.toFixed(2)
        },
        user: {
          isAnonymous: !req.session.user
        }
      })
    } else {
      res.send(`product with id ${productId} not found`)
    }
  },

  getProducts: (req, res) => res.render("products", {
    title: "Produkte",
    products: repository.findAllProducts().map(p => {
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price.toFixed(2),
      }
    }),
    user: {
      isAnonymous: !req.session.user
    }
  }),

  getCart: (req, res) => {
    const cart = repository.findCartByUserId(req.session.user.id)
    if (!cart) return res.render("cart", {
      cart: null,
      user: { isAnonymous: !req.session.user }
    })

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
    res.render("cart", {
      cart: {
        items: items,
        total: total.toFixed(2),
      },
      user: { isAnonymous: !req.session.user }
    })
  },

  postCart: (req, res) => {
    const { productId } = req.body
    const cart = repository.findOrCreateCartByUserId(req.session.user.id).addProduct(productId)
    repository.saveCart(cart)
    if (!req.session.cart) req.session.cart = { id: cart.id }
    res.redirect("/cart")
  },

  postCartRemove: (req, res) => {
    const { productId } = req.body
    let cart = repository.findCartByUserId(req.session.user.id)
    cart = cart.removeProduct(productId)
    if (cart.items.size === 0) {
      repository.deleteCartByUserId(req.session.user.id)
    } else {
      repository.saveCart(cart)
    }
    res.redirect("/cart")
  },
}

module.exports = shopController