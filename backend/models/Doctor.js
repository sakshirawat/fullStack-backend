const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Doctor documents
const doctorSchema = new Schema({
  // Name of the doctor
  name: {
    type: String,       // The doctor's name is stored as a string
    required: true      // This field is mandatory; every doctor must have a name
  },

  // Department or specialty of the doctor (e.g., Cardiology, Pediatrics)
  department: {
    type: String,       // Stored as a string describing the doctor's department
    required: true      // Mandatory field to specify the doctor's department
  }
});

// Export the Doctor model based on this schema
module.exports = mongoose.model('Doctor', doctorSchema);
