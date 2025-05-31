const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Middleware array to validate user registration data
exports.validateUser = [
  // 1. Logging middleware to confirm validation runs
  (req, res, next) => {
    console.log("🟡 validateUser middleware called");
    next();
  },

  // 2. Validate 'name' field:
  // - Remove leading/trailing spaces (.trim())
  // - Escape special characters to prevent injection attacks (.escape())
  // - Must not be empty
  // - Minimum length of 3 characters
  check('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('User name cannot be empty!')
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters required!'),

  // 3. Validate 'email' field:
  // - Remove leading/trailing spaces
  // - Normalize email (lowercase, remove dots in gmail, etc.)
  // - Must not be empty
  // - Must be a valid email format
  // - Custom async validator to check if email already exists in DB
  check('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email cannot be empty!')
    .isEmail()
    .withMessage('Invalid email address!')
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });
      if (userDoc) {
        // If email already exists, reject the request with an error message
        throw new Error('E-mail already exists, please use a different one.');
      }
    }),

  // 4. Validate 'password' field:
  // - Must not be empty
  // - Minimum length 6 characters
  check('password')
    .notEmpty()
    .withMessage('Password cannot be empty!')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long!'),

  // 5. Middleware to check all validation results after above rules run
  (req, res, next) => {
    // Gather all validation errors, if any
    const errors = validationResult(req);

    // If there are errors, create an error object and pass it to next middleware
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;  // Unprocessable Entity
      error.data = errors.array(); // Array of error details
      return next(error); // Pass to the centralized error handler
    }

    // If no errors, proceed to the next middleware or route handler
    next();
  }
];

// Middleware array to validate login data
exports.validateLogin = [
  // 1. Validate 'email' field:
  // - Trim spaces
  // - Normalize email format
  // - Must not be empty (isEmpty negated by .not())
  // - If empty, return "Email is required!"
  // - Bail to stop running further validations on this field if empty
  // - Validate email format if present
  check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Email is required!')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address!'),

  // 2. Validate 'password' field:
  // - Trim spaces
  // - Must not be empty
  // - If empty, return "Password is required!"
  // - Bail to stop further validation if empty
  // - Minimum length 6 characters if present
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required!')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long!'),

  // 3. Final middleware to check validation errors
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Throw an error with validation error details
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;  // Can be caught by centralized error handler middleware
    }

    // No errors, proceed further
    next();
  }
];
