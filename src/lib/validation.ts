import Joi from 'joi';

// Validação forte de senha: mínimo 12 caracteres, maiúscula, minúscula, número e especial
const passwordComplexity = Joi.string()
  .min(12)
  .max(128)
  .pattern(/[A-Z]/, { name: 'uppercase letter' })
  .pattern(/[a-z]/, { name: 'lowercase letter' })
  .pattern(/[0-9]/, { name: 'number' })
  .pattern(/[^a-zA-Z0-9]/, { name: 'special character' })
  .messages({
    'string.pattern.name': 'Password must contain at least one {#name}',
    'string.min': 'Password must be at least 12 characters long',
    'string.max': 'Password must be at most 128 characters long',
  });

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().trim().required(),
  password: passwordComplexity.required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

export const predictionSchema = Joi.object({
  matchId: Joi.string().uuid().required(),
  homeScore: Joi.number().integer().min(0).max(20).required(),
  awayScore: Joi.number().integer().min(0).max(20).required(),
});
