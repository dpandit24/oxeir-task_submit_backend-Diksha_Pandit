function errorHandler(err, req, res, next) {
  if (err instanceof Error && err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
  res.status(500).json({ message: err.message || 'Internal server error' });
}

module.exports = errorHandler; 