const mongoose =  require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema ({
    googleId: String,
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

mongoose.model('users', userSchema);