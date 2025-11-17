const Joi = require('joi');

const createJobDescriptionSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  requirements: Joi.string().min(10).allow(null, ''),
});

const updateJobDescriptionSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().min(10),
  requirements: Joi.string().min(10).allow(null, ''),
});

const matchJobSchema = Joi.object({
  top_n: Joi.number().integer().positive().default(10),
});

module.exports = {
  createJobDescriptionSchema,
  updateJobDescriptionSchema,
  matchJobSchema,
};