const multer = require('multer');
const path = require('path');

// Configure storage settings for multer
const storage = multer.diskStorage({
  // Destination folder where uploaded files will be saved
  destination: (req, file, cb) => {
    // 'uploads/' folder must exist at root of project or provide absolute path
    cb(null, 'uploads/');
  },

  // Define the filename for uploaded files
  filename: (req, file, cb) => {
    // Generate a unique suffix using current timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    // Extract the original file extension (e.g., '.jpg', '.png')
    const ext = path.extname(file.originalname);

    // Create final filename: <fieldname>-<uniqueSuffix>.<ext>
    // For example: 'report-1685541234567-123456789.png'
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Initialize multer middleware with the defined storage configuration
const upload = multer({ storage: storage });

// Export the configured multer instance for use in routes
module.exports = upload;
