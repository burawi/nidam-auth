var randomstring = require("randomstring");
var md5 = require('md5');

module.exports = function (G,conf) {

    var T = G.E[conf.tayrProp];
    var sessionTable = conf.sessionTable;

    var exports = {
        isAuthenticated: function (req, res, next) {
            return (req.user) ? next() : res.json({success: false, msg: conf.msg.authRequired, code: 'AUTHREQ'});
        },
        isAdmin: function (req, res, next) {
            return (req.user && req.user.role == "admin") ? next() : res.json({success: false, msg: conf.msg.adminRequired, code: 'ADMREQ'});
        },
        remember: function (req, res, next) {
            if(!req.user && req.cookies.sessionId !== undefined && req.cookies.sessionKey !== undefined){
                T.load(sessionTable, parseInt(req.cookies.sessionId)).then(function (session) {
                    if(md5(session.token) == req.cookies.sessionKey){
                        T.load(usersTable,session.userId).then(function (user) {
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
        setRemember: function (req, res) {
            return new Promise(function(resolve, reject) {
                var session = new T.tayr(sessionTable,{
                    userId: req.user.id,
                    token: randomstring.generate(10)
                });
                session.store().then(function () {
                    res.cookie('sessionId', session.id, { expires: new Date(Date.now() + 900000), httpOnly: true });
                    res.cookie('sessionKey', md5(session.token), { expires: new Date(Date.now() + 900000), httpOnly: true });
                    resolve();
                });
            });
        }
    };

    return exports;
}
