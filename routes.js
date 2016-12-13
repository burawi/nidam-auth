var express = require('express');
var router = express.Router();
var tayrPassport = require('tayr-passport');

module.exports = function(G) {

    var identifier = G.auth.conf.identifier;
    var T = G[G.auth.conf.tayrProp];
    var usersTable = G.auth.conf.usersTable;


    var passport = tayrPassport.use({
        app: G.app,
        T: T,
        usernameField: identifier,
    });

    router.get('/', function(req, res, next) {
        res.render(__dirname+'/page.pug',{lang: G.lang});
    });

    // GET CURRENT USER ID
    router.post('/session/userid', G.auth.middlewares.isAuthenticated, function(req, res, next) {
        res.json({ success: true, msg: req.user.id });
    });

    // Cookies Setter
    router.get('/remember', G.auth.middlewares.isAuthenticated, function(req, res, next) {
        G.auth.helpers.setRemember(req, res).then(function() {
            res.redirect('/');
        });
    });

    // LOGIN REQUEST
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/remember',
        failureRedirect: '/auth'
    }));

    // // REGISTER REQUEST
    // router.post('/register', function(req, res, next) {
    //     // Form Validation
    //     var formCheck = G.H.validation.check(req.body, G.H.validation.registerFormNorms);
    //     if (!formCheck.valid) {
    //         res.json({
    //             success: false,
    //             msg: G.H.lang.invalid(G.H.lang.email)
    //         });
    //     } else {
    //         // Check if email exists
    //         G.T.findOne('user', { sql: 'email = ?', vals: req.body.email }).then(function(user) {
    //             if (user) {
    //                 res.json({
    //                     success: false,
    //                     msg: G.H.lang.userExists
    //                 });
    //             } else {
    //                 var user = new G.T.tayr('user', G.H.underscore.pick(req.body, 'username', 'email'));
    //                 user.password = G.H.md5(req.body.password);
    //                 user.role = G.H.defaults.user.role;
    //                 user.register_date = new Date();
    //                 user.store().then(function() {
    //                     G.helpers.auth.manualLogin(user, req, res, next);
    //                 });
    //             }
    //         });
    //     }
    // });

    // LOGOUT
    router.get('/logout', function(req, res) {
        req.logout();
        res.clearCookie('sessionId');
        res.clearCookie('sessionKey');
        res.redirect('/');
    });

    // // SOCIAL AUTH
    // G.H.socials.list.forEach(function (social) {
    //     var pureUrl = '/' + social;
    //     var callbackURL = pureUrl + '/callback';
    //     router.get(pureUrl, G.passport.authorize(social, { scope : ['email'] }));
    //
    //     router.get(callbackURL, G.passport.authenticate(social, {
    //         successRedirect: '/auth/remember',
    //         failureRedirect: '/'
    //     }));
    // });

    return router;
};
