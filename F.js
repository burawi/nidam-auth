var randomstring = require("randomstring");
var md5 = require('md5');

module.exports = function (G,conf) {

    var T = G.E[conf.tayrProp];
    var sessionTable = conf.sessionTable;

    var exports = {
        isAuthenticated: function (req, res, next) {
            return (req.user) ? next() : res.json({success: false, msg: req.strs.authRequired, code: 'AUTHREQ'});
        },
        isAdmin: function (req, res, next) {
            return (req.user && req.user.role == "admin") ? next() : res.json({success: false, msg: req.strs.adminRequired, code: 'ADMNREQ'});
        },
        verifyAdminPassword: function (req, res, next) {
            return (req.user && req.user.password == md5(req.body.adminPassword)) ? next() : res.json({success: false, msg: req.strs.incorrectAdminPassword, code: 'ADMNICP'});
        },
        remember: function (req, res, next) {
            if(!req.user && req.cookies.sessionId !== undefined && req.cookies.sessionKey !== undefined){
                T.load(sessionTable, parseInt(req.cookies.sessionId)).then(function (session) {
                    if(md5(session.token) == req.cookies.sessionKey){
                        T.load(conf.usersTable,session.userId).then(function (user) {
                            req.logIn(user, function(err) {
                                if (err) { return next(err); }
                                next();
                            });
                        })
                    }else {
                        next();
                    }
                })
            }else {
                next();
            }
        },
        setRemember: function (req, res, next) {
            var session = new T.tayr(sessionTable,{
                userId: req.user.id,
                token: randomstring.generate(10)
            });
            session.store().then(function () {
                var expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
                res.cookie('sessionId', session.id, { expires: expiryDate, httpOnly: true });
                res.cookie('sessionKey', md5(session.token), { expires: expiryDate, httpOnly: true });
                next();
            });
        }
    };

    return exports;
}
