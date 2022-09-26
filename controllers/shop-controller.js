const repository = require("./../persistence/repository")

const shopController = {

  getProduct: (req, res) => {
    const { productId } = req.params
    const product = repository.findProductById(productId)
    if (product) {
      res.render("product", {
        title: product.name,
        product: product,
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
    products: repository.findAllProducts(),
    user: {
      isAnonymous: !req.session.user
    }
  }),

  getCart: (req, res) => res.send("CART"),

  postCart: (req, res) => res.send("ADDING TO CART"),
}

module.exports = shopController