const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const methodOverride = require('method-override');
const passport = require("passport");
const keys = require('./config/keys');
require("./models/Company");
require("./services/passport");
const User = mongoose.model('users');

const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 5000;

const app =  express();


// View Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(flash());

//body parser
app.use(bodyParser.urlencoded({extended: true}))
.use(bodyParser.json());


app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

//Set static folder
app.use(express.static(path.join(__dirname)));


app.use(passport.initialize());
app.use(passport.session());


//mongoose
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// require("./routes/indexRoutes")(app);
require("./routes/authRoutes")(app);

//Express messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// app.get('/register', (req, res) => {
//     res.render("register");
// });

// //handling user sign up
// app.post("/register", (req, res) => {
//     req.body.username;
//     req.body.password;
//     let newUser = new User({
//         username: req.body.username,
//         password: req.body.password
//     });
//     User.register(newUser, req.body.password, (err, user) => {
//         if (err) {
//             console.log(err);
//             req.flash("error", "A user with the given username is already registered");
//             return res.render('register', {
//                 error: err.message
//             });
//         }
//         passport.authenticate("local")(req, res, () => {
//             req.flash("success", "Successfully signed up! Welcome to the Dashboard, " + req.body.username);
//             res.redirect("/companies");
//         })
//     });
// });

// Handle 404
app.use(function (req, res) {
    res.render('notFound');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('errorMessage', {
        message: err.message,
        error: {}, 
        success: {}
        
    });
});


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});