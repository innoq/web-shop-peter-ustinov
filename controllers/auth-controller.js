const sessionUtils = require("./session-utils")
const repository = require("./../persistence/repository")
const bcrypt = require("bcrypt")

const authController = {

  getLogin(req, res) {
    const viewModel = sessionUtils.generateBaseViewModelFromSession(req.session)
    return res.render("login", viewModel)
  },

  postLogin(req, res) {
    const { name, password } = req.body
    const user = authenticate(name, password)

    if (user) {
      sessionUtils.createUserSession(req.session, user)
      let route = "/"
      if (req.session.intendedRoute) {
        route = req.session.intendedRoute
        // we are redirecting where the user wanted to go originally, delete the cached route
        delete req.session.indendedRoute
      }
      res.redirect(route)
    } else {
      req.session.error = "Die Zugangsdaten sind ungültig."
      res.redirect("/login")
    }
  },

  postLogout(req, res) {
    sessionUtils.deleteUserSession(req.session)
    res.redirect("/")
  },

  getSignup(req, res) {
    const viewModel = sessionUtils.generateBaseViewModelFromSession(req.session)
    res.render("signup", viewModel)
  },

  postSignup(req, res) {
    const { name, password } = req.body
    const hash = bcrypt.hashSync(password, 10)
    const user = repository.createUser(name, hash)
    console.log("created new user:", user)
    sessionUtils.createUserSession(req.session, user)

    let route = "/"
    if (req.session.intendedRoute) {
      route = req.session.intendedRoute
      delete req.session.intendedRoute
    }
    res.redirect(route)
  },

  getUsers(req, res) {
    const users = repository.findAllUsers()
    res.send(users)
  },
}

function authenticate(name, password) {
  const user = repository.findUserByName(name)
  return (user && bcrypt.compareSync(password, user.hashedPassword)) ? user : null
}

module.exports = authController