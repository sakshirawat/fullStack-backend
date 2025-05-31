// Import mongoose and extract Schema constructor
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Patient documents
const patientSchema = new Schema({
  // Reference to the User model, linking patient to a specific user
  userId: {
    type: Schema.Types.ObjectId,  // ObjectId type referring to User collection's _id
    ref: 'User',                  // Reference model is 'User' for population purposes
    required: true                // This field is mandatory; every patient must be linked to a user
  },

  // Patient's full name
  name: {
    type: String                 // String type, optional (not explicitly required)
  },

  // Contact phone number of the patient
  phone: {
    type: String                 // Stored as a string to support various phone formats
  },

  // Email address of the patient
  email: {
    type: String                 // Patient's email; can be used for notifications/contact
  },

  // Patient's residential address
  address: {
    type: String                 // String type, stores street address or other details
  },

  // City where the patient resides
  city: {
    type: String
  },

  // State or province of the patient
  state: {
    type: String
  },

  // Postal or zip code for the patient's address
  zipcode: {
    type: String                 // Stored as string to support alphanumeric postal codes
  }
});

// Export the Patient model based on this schema
module.exports = mongoose.model('Patient', patientSchema);
