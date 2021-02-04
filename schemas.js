const Joi = require('joi');
module.exports.safetypinSchema  = Joi.object( {
    safetypin: Joi.object({
        location: Joi.string().required(),
        safety_index: Joi.number().required().min(0),
        image:Joi.string().required(),
        address:Joi.string().required(),
        description:Joi.string().required(),
    }).required()
})

