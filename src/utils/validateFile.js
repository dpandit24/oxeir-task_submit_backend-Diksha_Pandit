const path = require('path');

function isValidFile(file) {
  // Only allow PDF for now
  const allowedTypes = ['application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) return false;
  // Check extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') return false;
  // Add more checks (virus scan, etc.) as needed
  return true;
}

module.exports = { isValidFile }; 