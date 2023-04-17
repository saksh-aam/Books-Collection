const Joi = require("joi");

module.exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().min(8).required().email(),
    password: Joi.string().min(8),
  });

  return schema.validate(data); 
};
module.exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(8).required().email(),
    password: Joi.string().min(8),
  });

  return schema.validate(data);
};

module.exports.bookValidation = (data) => {
  const bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
    publishDate: Joi.date(),
  });
  return bookSchema.validate(data);
}


