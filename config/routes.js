var db = require("../app/models/users");
/*var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;*/

module.exports = function(app, passport){
	// process the login form
  // added parameters to passport local
    app.post("/login", passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }), function(req, res, next) { //removed passport.authenticate('local-login')
      res.json(req.user);
    });

    // handle logout
    app.post("/logout", function(req, res) {
      req.logOut();
      res.send(200);
    })

    // loggedin
    app.get("/loggedin", function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

    // signup
    app.post("/signup", function(req, res) {
      db.User.findOne({
        username: req.body.username
      }, function(err, user) {
        if (user) {
          res.json(null);
          return;
        } else {
          var newUser = new db.User();
          newUser.username = req.body.username.toLowerCase();
          newUser.password = newUser.generateHash(req.body.password);
          newUser.save(function(err, user) {
            req.login(user, function(err) {
              if (err) {
                return next(err);
              }
              res.json(user);
            });
          });
        }
      });
    });
}