module.exports = {

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    },

    isNotLoggedIn(req, res, next) {
            if(!req.isAuthenticated()) {
                return next();
            }
            return res.redirect('/dashboard');
    },

    isAdmin(req, res, next){
        if(req.user.rol == 'Administrador'){
            return next();
        }
        return res.redirect('/table_hallazgos/' + req.user.id_usuario);
    },   

    isBasic(req, res, next){
        if(req.user.rol == 'Estándar'){
            return next();
        }
        return res.redirect('/dashboard');
    },

    GetUserId(req, res, next){
        if(req.user.id_usuario == req.user.id_usuario){
            console.log(req.user.id_usuario);
            return next();
        }
    }
}