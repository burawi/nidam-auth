var randomstring = require("randomstring");

module.exports = function (G) {
    var exports = {
        tayrProp: 'T',
        usersTable: 'user',
        sessionTable: 'session',
        identifier: 'username',
        msg: {
            authRequired: 'Authentication required! please login',
            adminRequired: 'Only Admins can do that!',
            login: 'Login',
            username: 'username',
            password: 'password',
            connection: 'connection'
        }
    };

    return exports;
}
