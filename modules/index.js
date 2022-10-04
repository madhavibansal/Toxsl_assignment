const path = require('path') 
const User = require("../models/index");
const bcrypt = require("bcrypt");
const {RegisterValidation,LoginValidation} = require("../validation/index");
const jwt = require("jsonwebtoken");

exports.register = async (req, res,next) => {

    const {error} = RegisterValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    
    const emailExist = await User.findOne({email:req.body.email})
    if(emailExist) return res.status(400).send("Email is already exist");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password,salt);

    const file = req.files
    if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
    }
    const imageFile = file.map(file=>file.path)
    const user = await new User({
    name:req.body.name,
    email:req.body.email,
    password: hashedPass,
    address:req.body.address,
    image: imageFile
})
        try{
           const saveduser = await user.save().then(user => {
               res.json({user})
           })
       }
       catch(err) {
           res.status(400).send(err);
       }
}

exports.login = async (req,res) => {
    const {error} = LoginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    const users = await User.findOne({email:req.body.email})
    if(!users) return res.status(400).send("Email is not valid");
    
    const pass = await bcrypt.compare(req.body.password,users.password);
    if(!pass) res.status(400).send("Password is Incorrect")
    
    const token = jwt.sign({_id:User._id},process.env.SECRET);
    res.header("auth",token,{httpOnly:true}).status(200).json({
        message:"Succesfully Login",
        token
    })
    
}

exports.getUser = async (req,res) => {
    const getDetail = await User.find({_id:req.body._id})
   return res.status(200).send({getDetail})
}
