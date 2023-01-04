const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        trim:true
    },
    email: {
        type: String,
        require: true,
        unique:true,
        trim:true
    },
    mobile: {
        type: Number,
        require: true,
        maxLength: 10
    },
    profilePicture: {
        type: Buffer,
        require: true
    },
    password: {
        type: String,
        require: true,
        trim:true
    }

})

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel }