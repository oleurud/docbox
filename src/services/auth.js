import webService from './webservice';

module.exports = {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1]
        if (localStorage.token) {
            if (cb) cb(true)
            this.onChange(true)
            return
        }

        let handleResponse = (err, response) => {
            if(err || !response.token) {
                if (cb) cb(false)
                this.onChange(false)
            } else {
                localStorage.token = response.token
                if (cb) cb(true)
                this.onChange(true)
            }
        };

        webService.doCall(
            'POST',
            '/auth/login',
            {
                email: email,
                password: pass
            },
            {},
            handleResponse
        )
    },

    getToken() {
        return localStorage.token
    },

    logout(cb) {
        delete localStorage.token
        if (cb) cb()
        this.onChange(false)
    },

    loggedIn() {
        return !!localStorage.token
    },

    onChange() {},
};
