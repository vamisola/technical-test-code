const passport = require("passport");

module.exports = (app) => {

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/companies',
        failureRedirect: '/',
        failureFlash: true,
        successFlash: 'You are logged in'
    }), (req, res, next) =>{    
        res.redirect("/");
    });


    app.get('/api/logout', (req, res) => {
        req.logout();
        req.flash("success", "You're logged out!");
        //res.send(req.user);
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });


    app.post('/', passport.authenticate("local", {
        successRedirect: '/companies',
        failureRedirect: '/',
        failureFlash: true,
        successFlash: 'Welcome to the Dashboad!'
    }), (req, res, next) => {
        req.flash("error", "User not found!");
    });
};