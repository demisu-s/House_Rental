const Joi = require('joi');

const userValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().max(20).pattern(new RegExp('^[a-zA-Z]+$')),
        lastName: Joi.string().max(20).pattern(new RegExp('^[a-zA-Z]+$')),
        location: Joi.string().max(40),
        phone: Joi.number(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        role: Joi.string().valid('user', 'admin', 'broker', 'superAdmin', 'tenant') // Add validation for the "role" field
    }); 

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = { userValidator };
