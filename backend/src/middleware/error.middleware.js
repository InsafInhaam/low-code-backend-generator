export const errorhandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, error: err.message });
};
