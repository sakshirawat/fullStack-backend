const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the "Service" collection in MongoDB
// This schema represents medical or healthcare-related services offered,
// such as checkups, consultations, treatments, or procedures.
const serviceSchema = new Schema({
  // The official name of the service, e.g., "General Checkup", "Blood Test"
  name: {
    type: String,        // Data type: String
    required: true       // This field must be provided; a service cannot be created without a name
  },

  // A detailed explanation or summary of what the service includes
  // For example, "A comprehensive physical examination to assess overall health"
  description: {
    type: String         // Data type: String
    // This field is optional and can be left blank if not needed
  },

  // A visual representation of the service, useful for UI elements
  // This could be the file name or URL of an icon/image to display on the frontend
  icon: {
    type: String         // Data type: String
    // Optional field, intended to store an image or icon reference
  },

  // Categorizes the service by medical department or specialty
  // Example: "Cardiology", "Dermatology", "General Medicine"
  department: {
    type: String         // Data type: String
    // This field is optional and helps organize/filter services by departments
  }
});

// Export the Mongoose model named 'Service' which uses the serviceSchema
// This model will be used in the application to create, read, update, and delete service documents
module.exports = mongoose.model('Service', serviceSchema);
