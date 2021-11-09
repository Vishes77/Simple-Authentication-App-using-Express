const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,'Username can not be Blank']
    },
    password: {
        type:String,
        required:[true,'Password cannot be Blank']
    }
})

module.exports = mongoose.model('User', userSchema);