const Joi = require("joi");
const userValidator = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
    role: Joi.string()
      .valid("user", "tenant", "landlord", "admin", "broker")
      .default("user"),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details.map((err) => err.message) });
  }
  next();
};
module.exports = {
  userValidator,
};
