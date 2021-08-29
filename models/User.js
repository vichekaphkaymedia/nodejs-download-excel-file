const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: String,
	firstName: String,
	lastName: String,
    password: String,
},{
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User
