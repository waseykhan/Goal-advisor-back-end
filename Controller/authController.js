const User = require('../Models/Users');
const jwt = require('jsonwebtoken');
const maxAge = 5 * 24 * 60 * 60;
const createJWT = id => {
    return jwt.sign({id}, 'Goal-Advisor Secret', {expiresIn: maxAge})
};

const alerErrorNew = (error) => {
    return error.message;
}

const alertErrors = (err) => {
    let errors = { name:'', email:'', password:''}

    if(err.code === 11000){
        errors.email = "This email has previously been used to create an account";
        return errors;
    }

    if(err.message.includes('user validation failed')){
        let obj = Object.values(err.errors).forEach(properties => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

module.exports.signup = async (req, res)=>{
    const {name, email, password} = req.body;
    try{
        const user = await User.create({name, email, password});
        const token = createJWT(user._id); 
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user});
    }catch (error) {
        let err = alertErrors(error)
        res.status(400).json({err})
    }
}

module.exports.login = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createJWT(user.id); 
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user});
    }catch (error) {
        let err = alerErrorNew(error)
        res.status(400).json({err})
    }
}

module.exports.verifyuser = async (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'Goal-Advisor Secret', async(err, decodedToken) => {
            if(err){
                console.log(err.message);
            }else{
                let user = await User.findById(decodedToken.id);
                res.json(user);
                next();
            }
        })
    }else{
        next();
    }
}

module.exports.logout = (req, res)=>{
    res.cookie('jwt', "", { maxAge: 1})
    res.status(200).json({logout: true});
}