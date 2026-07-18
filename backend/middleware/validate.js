import { AppError } from '../utils/AppError.js';
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) return next(new AppError(result.error.issues.map((item) => item.message).join(', '), 422));
  req.validated = result.data;
  next();
};
