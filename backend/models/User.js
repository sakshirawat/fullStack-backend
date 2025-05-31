const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for User documents in MongoDB
// This schema represents the users of your application, such as patients or general users
const userSchema = new Schema({
  // The full name of the user (e.g., "John Doe")
  name: {
    type: String,        // Data type: String
    required: true       // This field is mandatory; every user must have a name
  },

  // The user's email address, used for login and communication
  email: {
    type: String,        // Data type: String
    required: true       // Required field; unique user identification is often done via email
    // (Optional: You might want to add unique: true here to enforce uniqueness at DB level)
  },

  // The user's password, which will be stored in hashed form for security
  password: {
    type: String,        // Data type: String
    required: true       // This field is mandatory; every user must have a password
    // Note: Password should always be hashed before saving to DB for security
  }
});

// Export the Mongoose model named 'User' based on this schema
// This model is used throughout your application to interact with user data (create, read, update, delete)
module.exports = mongoose.model('User', userSchema);
