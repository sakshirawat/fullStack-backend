const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Appointment documents
const appointmentSchema = new Schema({
  // Reference to the User who booked the appointment
  userId: {
    type: Schema.Types.ObjectId,  // Stores ObjectId from User collection
    ref: 'User',                  // Reference to the User model for population
    required: true                // This field is mandatory
  },

  // The ID of the doctor with whom the appointment is booked
  doctorId: {
    type: String,                 // Stored as a string (could be ObjectId string or other identifier)
    required: true                // Mandatory field
  },

  // Name of the doctor for easy reference and display
  doctorName: {
    type: String,
    required: true
  },

  // Department or specialty of the doctor (e.g., Cardiology, Dermatology)
  doctorDepartment: {
    type: String,
    required: true
  },

  // The date of the appointment (without time part ideally)
  date: {
    type: Date,
    required: true                // Appointment date is mandatory
  },

  // The time slot of the appointment (e.g., "10:00 AM - 10:30 AM")
  time: {
    type: String,
    required: true
  },

  // Optional comments or notes the user might add for the doctor
  comments: {
    type: String
  },

  // Path to the uploaded medical report file (if any)
  report: {
    type: String                 // This stores the file path as a string
  }
}, 
// Enable automatic creation of 'createdAt' and 'updatedAt' timestamp fields
{ timestamps: true });

// Export the Appointment model based on this schema
module.exports = mongoose.model('Appointment', appointmentSchema);
