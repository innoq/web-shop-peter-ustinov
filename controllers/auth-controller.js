const repository = require("./../persistence/repository")
const bcrypt = require("bcrypt")

const authController = {

  restrict: (req, res, next) => req.session.user ? next() : res.redirect("/login"),

  getLogin: (req, res) => res.render("login", {
    title: "Anmeldung",
    user: { isAnonymous: !req.session.user }
  }),

  postLogin: (req, res) => {
    const { name, password } = req.body
    const user = authenticate(name, password)

    if (user) {
      createUserSession(req, user)
      res.redirect("/")
    } else {
      res.redirect("/login")
    }
  },

  postLogout: (req, res) => {
    deleteUserSession(req)
    res.redirect("/")
  },

  getSignup: (req, res) => res.render("signup", {
    title: "Kontoerstellung",
    user: {
      isAnonymous: !req.session.user
    }
  }),

  postSignup: (req, res) => {
    const { name, password } = req.body
    const hash = bcrypt.hashSync(password, 10)
    const user = repository.createUser(name, hash)
    createUserSession(req, user)
    res.redirect("/")
  },

  getUsers: (req, res) => {
    const users = repository.findAllUsers()
    res.send(users)
  },
}

function createUserSession(req, { id }) {
  req.session.user = { id }
}

function deleteUserSession(req) {
  delete req.session.user
}

function authenticate(name, password) {
  const user = repository.findUserByName(name)
  return (user && bcrypt.compareSync(password, user.hashedPassword)) ? user : null
}

module.exports = authController