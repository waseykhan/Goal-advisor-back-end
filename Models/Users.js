const mongoose = require('mongoose');
const {isEmail} = require('validator');

const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a name'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minlength: [6, 'The password is too small']
    },
    list: {
        goal: Array
    }
}, {timestamps:true})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const isAuthenticated = password === user.password;
        if(isAuthenticated){
            return user;
        }else{
            throw Error("Incorrect Password")
        }
    }else{
        throw Error("Incorrect Email");
    }
}


const User = mongoose.model('user', userSchema);
module.exports = User;

