const Joi = require('joi');

const validateUser = (data) =>{
    const schema = Joi.object({
        username: Joi.string().min(6).max(30).required(),
		password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
		email: Joi.string().email().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
    });

    return schema.validate(data,{abortEarly: false});
};

module.exports = validateUser;