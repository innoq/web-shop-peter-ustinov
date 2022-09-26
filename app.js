const express = require("express")
const morgan = require("morgan")
const path = require("path")
const routes = require("./routes/routes")
const session = require("express-session")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
  secret: "SECRET",
  resave: false,
  saveUninitialized: false
}))

app.use(routes)

app.listen(3000)