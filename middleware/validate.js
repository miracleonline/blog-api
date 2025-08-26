import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const formatted = errors.array().map((e) => ({ field: e.param, msg: e.msg }));
  next(new ApiError(422, 'Validation failed: ' + JSON.stringify(formatted)));
};
