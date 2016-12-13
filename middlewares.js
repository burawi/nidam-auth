var md5 = require('md5');

module.exports = function (G) {

    var T = G[G.auth.conf.tayrProp];
    var usersTable = G.auth.conf.usersTable;
    var sessionTable = G.auth.conf.sessionTable;

    var exports = {
        isAuthenticated: function (req, res, next) {
            return (req.user) ? next() : res.json({success: false, msg: G.lang.authRequired, code: 'AUTHREQ'});
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
        }
    };

    return exports;
}
