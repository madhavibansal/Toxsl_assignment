const joi = require("@hapi/joi");
exports.RegisterValidation = (data) => {
    const schema = {
        name:joi.string().min(6).required(),
        email:joi.string().required().email(),
        password:joi.string().min(8).required(),
        address:joi.string().min(8).required(),
        profilePic:joi.string()
    }
    return joi.validate(data,schema);
    
}
exports.LoginValidation = (data) => {
    const schema = {
       
        email:joi.string().required().email(),
        password:joi.string().min(8).required(),
        
    }
    return joi.validate(data,schema);
    
}