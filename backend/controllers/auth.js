const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');


// Controller to handle user sign-up (registration)
exports.signUp = async (req, res, next) => {
  console.log('user entered');
  const { email, password, name } = req.body;

  try {
    // 1. Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user already exists, reject signup with 400 error
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 2. Hash the plaintext password using bcrypt with salt rounds = 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create a new User document with hashed password and provided info
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Save the new user to the database
    const savedUser = await newUser.save();

    // 5. Create an associated Patient profile for this new user
    // This lets us separate authentication (User) from patient-specific details (Patient)
    const newPatient = new Patient({
      userId: savedUser._id, // Reference to User document
      name: name,            // Initialize with same name (can be updated later)
      email: email,          // Store email for quick access if needed
      // Other patient-specific fields can be left blank or defaulted here
    });

    // 6. Save the new patient profile
    await newPatient.save();

    // 7. Respond with success status and message
    res.status(201).json({ message: 'User and patient profile created successfully' });
  } catch (err) {
    // Log error and respond with 500 status
    console.error('Signup error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};


// Controller to handle user login/authentication
exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  // 1. Find the user by email in the database
  User.findOne({ email: email })
    .then(user => {
      // 2. If user not found, throw an error
      if (!user) {
        throw new Error("Email doesn't exist!");
      }
      loadedUser = user;

      // 3. Compare the provided password with hashed password stored in DB
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      // 4. If password doesn't match, throw error
      if (!isEqual) {
        throw new Error('Password not matched');
      }

      // 5. Generate a JSON Web Token (JWT) for session/authentication
      const token = jwt.sign(
        {
          name: loadedUser.name,
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        process.env.JWT_SECRET,    // Secret key stored in environment variable
        { expiresIn: '23h' }       // Token expiration time
      );

      // 6. Respond with success message, token, and basic user info
      res.json({ message: 'User logged in!', token, userId: loadedUser._id.toString(), name: loadedUser.name });
    })
    .catch(err => {
      // Pass any errors to error handling middleware
      next(err);
    });
};


// Controller to add or update patient profile details
exports.addPatientDetails = async (req, res, next) => {
  try {
    // 1. Check if a Patient profile already exists for the logged-in user
    const existingProfile = await Patient.findOne({ userId: req.userId });

    if (existingProfile) {
      // 2. If profile exists, update it with new fields from request body
      const updated = await Patient.findOneAndUpdate(
        { userId: req.userId },  // filter by userId
        { ...req.body },         // update fields with new data
        { new: true }            // return updated document
      );

      // 3. Return the updated profile
      return res.json(updated);
    }

    // 4. If no existing profile, create a new one with provided data
    const newProfile = new Patient({ ...req.body, userId: req.userId });

    // 5. Save new patient profile to DB
    await newProfile.save();

    // 6. Return newly created profile
    res.json(newProfile);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to fetch patient profile details for logged-in user
exports.getPatientDetails = async (req, res, next) => {
  try {
    // 1. Find patient profile by userId (populated by authentication middleware)
    const profile = await Patient.findOne({ userId: req.userId });

    // 2. If no profile found, return 404 not found error
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // 3. Return patient profile as JSON response
    res.json(profile);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
};
