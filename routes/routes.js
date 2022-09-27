const express = require("express")
const authController = require("../controllers/auth-controller")
const shopController = require("../controllers/shop-controller")

const router = express.Router()

// shop routes
router.get("/", shopController.getProducts)
router.get("/products", shopController.getProducts)
router.get("/product/:productId", shopController.getProduct)
router.get("/cart", authController.restrict, shopController.getCart)
router.post("/cart", authController.restrict, shopController.postCart)
router.post("/cart/remove", authController.restrict, shopController.postCartRemove)

// authentication routes
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.post("/logout", authController.restrict, authController.postLogout)
router.get("/signup", authController.getSignup)
router.post("/signup", authController.postSignup)
router.get("/users", authController.getUsers)

module.exports = router