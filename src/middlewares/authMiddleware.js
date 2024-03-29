// Middleware para validar que el usuario no está logeado, si está logeado lo redirecciono a su perfil

function authMiddleware(req, res, next) {
    if (req.session.userLogged != undefined) {
        res.redirect('/users/profile');
    } else {
        next();
    }
}

module.exports = authMiddleware;