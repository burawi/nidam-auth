var randomstring = require("randomstring");
var md5 = require('md5');

module.exports = function (G) {

    var T = G[G.auth.conf.tayrProp];
    var sessionTable = G.auth.conf.sessionTable;

    var exports = {
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
