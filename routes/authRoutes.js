const passport = require("passport");
const fs = require("fs");
const dataFile = "./data/company.json";
const _ = require("underscore");
const middleware = require('../middleware/index');

module.exports = (app) => {

    let companies = {};
    let filterActive = {};
    let filterInactive = {};

    fs.readFile(dataFile, "utf-8", (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        companies = parsedData;
        console.log(companies);

        filterActive = _.where(companies.company, {
            status: "active"
        });
        console.log(filterActive);

        filterInactive = _.where(companies.company, {
            status: "inactive"
        });
        console.log(filterInactive);


    });

    app.get('/', (req, res) => {
        res.render("login");
    });

    app.get('/companies', middleware.isLoggedIn, (req, res) => {
        res.render("landing", {
            user: req.user,
            companies: companies,
            filterActive: filterActive,
            filterInactive: filterInactive
        });
    });

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
        req.flash("success", "You're logged in!");
        res.redirect("/");
    });


    app.get('/api/logout', (req, res) => {
        req.logout();
        req.flash("error", "You're logged out!");
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

//Register route

    app.get('/register', (req, res) => {
        res.render("register", {message: req.flash('loginMessage')});
    });

    //handling user sign up
    app.post("/register", (req, res) => {
        req.body.username;
        req.body.password;
        let newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                req.flash("error", "A user with the given username is already registered");
                return res.render('register', {
                    error: err.message
                });
            }
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Successfully signed up! Welcome to the Dashboard, " + req.body.username);
                res.redirect("/companies");
            })
        });
    });
};