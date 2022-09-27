const express = require("express")
const authController = require("../controllers/auth-controller")
const shopController = require("../controllers/shop-controller")

const router = express.Router()

// shop routes
router.get("/", shopController.getProducts)
router.get("/products", shopController.getProducts)
router.get("/product/:productId", shopController.getProduct)
router.get("/cart", shopController.getCart)
router.post("/cart", shopController.postCart)

// authentication routes
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.post("/logout", authController.postLogout)
router.get("/signup", authController.getSignup)
router.post("/signup", authController.postSignup)
router.get("/users", authController.getUsers)

module.exports = router