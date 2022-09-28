const repository = require("../persistence/repository")

exports.generateBaseViewModelFromSession = (session) => {
    const user = session.user ? repository.findUserById(session.user.id) : null
    const cart = user ? repository.findCartByUserId(user.id) : null

    const viewModel = {
        message: session.message,
        error: session.error,
        user: {isAnonymous: user === null},
        cart: {itemCount: cart?.itemCount || 0},
    }
    if (user) viewModel.user.name = user.name
    return viewModel
}

exports.clearSessionForNextRequest = (session) => {
    delete session.message
    delete session.error
}

exports.createUserSession = (session, { id }) => {
    session.user = { id }
}

exports.deleteUserSession = (session) => {
    delete session.user
}

