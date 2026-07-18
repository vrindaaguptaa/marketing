export const notFound = (req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

export const errorHandler = (error, req, res, next) => {
  if (!error.isOperational) console.error(error);
  if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource id.' });
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'A record with that value already exists.' });
  if (error.name === 'ValidationError') return res.status(422).json({ success: false, message: 'Validation failed.', errors: Object.values(error.errors).map((item) => item.message) });
  res.status(error.statusCode || 500).json({ success: false, message: error.isOperational ? error.message : 'An unexpected server error occurred.' });
};
