const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a sub-schema for individual appointment slots
const slotSchema = new Schema(
  {
    time: {
      type: String,   // The time of the appointment slot, e.g., "10:00 AM"
      required: true, // This field must be provided for each slot
    },
    isBooked: {
      type: Boolean,  // Boolean flag to indicate if the slot is already booked
      default: false, // Defaults to false, meaning the slot is initially available
    },
  },
  { _id: false } // Disable automatic _id generation for each slot subdocument
  // This prevents Mongoose from creating a unique ObjectId for every slot,
  // since these slots are embedded subdocuments and don't need individual _id fields.
);

// Define the main schema for available appointments associated with doctors
const availableAppointmentSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId, // Store a MongoDB ObjectId reference to a Doctor document
    ref: 'Doctor',              // Reference model name for population (link to 'Doctor' collection)
    required: true,             // doctorId is required to associate slots with a specific doctor
  },
  doctorName: {
    type: String,   // Store the doctor's name as a string (denormalized for easy display)
    required: true, // doctorName must be provided to identify the doctor without population
  },
  slots: [slotSchema], // Array of embedded slotSchema subdocuments representing appointment times
  // Each slot has a time and a booking status, allowing multiple slots per doctor
});

// Export the model so it can be used elsewhere in your app to query or create available appointments
module.exports = mongoose.model('AvailableAppointment', availableAppointmentSchema);
