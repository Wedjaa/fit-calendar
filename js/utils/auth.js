const firebase = require('firebase/app');
const firebaseAuth = require('firebase/auth');

/** Initialize Firebase **/
var config = {
    apiKey: "AIzaSyDT1cJorgF_hEHEidx8Ty1DYD49fGMSfoc",
    authDomain: "fit-cal.firebaseapp.com",
    databaseURL: "https://fit-cal.firebaseio.com",
    storageBucket: "fit-cal.appspot.com",
    messagingSenderId: "1070599467128"
};

var authDatabase = firebase.initializeApp(config);

/**
 * Authentication lib
 * @type {Object}
 */
var auth = {
    /**
   * Logs a user in
   * @param  {string}   username The username of the user
   * @param  {string}   password The password of the user
   * @param  {Function} callback Called after a user was logged in on the remote server
   */
    login(username, password, callback) {
        // If there is a token in the localStorage, the user already is
        // authenticated
        if (this.loggedIn()) {
            callback(true);
            return;
        }

        var provider = new firebaseAuth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        firebaseAuth.signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(`User: ${JSON.stringify(user)}`)
        }).catch(function(error) {
            // Handle Errors here.
            console.log(`Auth Error: `);
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    },

    /**
   * Logs the current user out
   */
    logout(callback) {
        request.post('/logout', {}, () => {
            callback(true);
        });
    },
    /**
   * Checks if anybody is logged in
   * @return {boolean} True if there is a logged in user, false if there isn't
   */
    loggedIn() {
        var user = firebaseAuth.currentUser;
        return !!user;
    },
    /**
   * Registers a user in the system
   * @param  {string}   username The username of the user
   * @param  {string}   password The password of the user
   * @param  {Function} callback Called after a user was registered on the remote server
   */
    register(username, password, callback) {
        // Post a fake request
        request.post('/register', {
            username,
            password
        }, (response) => {
            // If the user was successfully registered, log them in
            if (response.registered === true) {
                this.login(username, password, callback);
            } else {
                // If there was a problem registering, show the error
                callback(false, response.error);
            }
        });
    },
    onChange() {}
}

module.exports = auth;
