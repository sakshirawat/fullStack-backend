const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const AvailableAppointment = require('../models/AvailableAppointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (req, res, next) => {
  // Extract appointment details from request body
  const { doctorId, doctorName, doctorDepartment, time, date, comments } = req.body;
  // User ID retrieved from the decoded JWT (set by isAuth middleware)
  const userId = req.userId;
  // Path to uploaded report file (if any)
  const reportPath = req.file ? req.file.path : null;

  try {
    // Convert date string to Date object
    const appointmentDate = new Date(date);

    // Validate if the appointment date is a valid date
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid appointment date.' });
    }

    // Get the current date/time on server
    const now = new Date();

    // Normalize current date and appointment date to midnight to compare only dates (ignore time)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());

    // Reject booking if appointment date is in the past (before today)
    if (appointmentDay < today) {
      return res.status(400).json({ message: 'Cannot book an appointment in the past.' });
    }

    // Reject booking if appointment date is Sunday (getDay() returns 0 for Sunday)
    if (appointmentDate.getDay() === 0) {
      return res.status(400).json({ message: 'Booking is not allowed on Sundays.' });
    }

    // Atomically mark the appointment slot as booked in AvailableAppointment collection
    // Only if the slot is currently not booked (isBooked: false)
    const slotUpdateResult = await AvailableAppointment.updateOne(
      {
        doctorId,
        "slots.time": time,
        "slots.isBooked": false
      },
      {
        $set: { "slots.$.isBooked": true }
      }
    );

    // If no slots were updated, it means slot is already booked or invalid
    if (slotUpdateResult.modifiedCount === 0) {
      return res.status(400).json({ message: 'This appointment slot is no longer available' });
    }

    // Create a new appointment document in Appointment collection
    const appointment = new Appointment({
      userId,
      doctorId,
      doctorName,
      doctorDepartment,
      date: date,
      time: time,
      comments,
      report: reportPath
    });

    // Save appointment to DB
    await appointment.save();

    // Respond success
    res.status(201).json({ message: 'Appointment booked successfully', appointment });

  } catch (err) {
    // Pass any errors to global error handler middleware
    next(err);
  }
};

exports.addAvailableAppointment = async (req, res, next) => {
  try {
    const { doctorId, time } = req.body;

    // Validate required fields
    if (!doctorId || !time) {
      return res.status(400).json({ message: 'doctorId and dateTime are required' });
    }

    // Find the AvailableAppointment document for given doctor
    const appointmentDoc = await AvailableAppointment.findOne({ doctorId });

    if (!appointmentDoc) {
      // If no document found for doctor, return 404
      return res.status(404).json({ message: 'Doctor record not found' });
    }

    // Add a new slot object to slots array with time and unbooked status
    appointmentDoc.slots.push({
      time: time,
      isBooked: false
    });

    // Save the updated AvailableAppointment document
    await appointmentDoc.save();

    // Respond with the updated document
    res.status(201).json({
      message: 'Available slot added',
      availableAppointment: appointmentDoc
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserAppointments = (req, res, next) => {
  const userId = req.userId;

  // Find all appointments for the logged-in user, sorted by date descending (newest first)
  Appointment.find({ userId: userId })
    .sort({ date: -1 })
    .then(appointments => {
      res.status(200).json({ appointments });
    })
    .catch(err => next(err));
};

exports.getAllServices = (req, res, next) => {
  // Retrieve all service documents from Service collection
  Service.find()
    .then(services => {
      res.status(200).json({ services });
    })
    .catch(err => next(err));
};

exports.getDoctors = async (req, res, next) => {
  try {
    // Fetch all doctors from Doctor collection
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    // Handle errors with status 500 (server error)
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};

exports.addDoctor = async (req, res, next) => {
  try {
    const { name, department } = req.body;

    // Create new Doctor document
    const doctor = new Doctor({ name, department });
    const savedDoctor = await doctor.save();

    // Create a placeholder AvailableAppointment document for this new doctor with no slots yet
    await AvailableAppointment.create({
      doctorId: savedDoctor._id,
      doctorName: savedDoctor.name,
    });

    res.status(201).json({
      message: 'Doctor added successfully and placeholder appointment created',
      doctor: savedDoctor,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.body;

    // doctorId is required to fetch slots
    if (!doctorId) {
      return res.status(400).json({ message: 'doctorId is required' });
    }

    // Find available appointment document for doctor
    const appointmentDoc = await AvailableAppointment.findOne({ doctorId });

    if (!appointmentDoc) {
      return res.status(404).json({ message: 'No available appointments found for this doctor' });
    }

    // Filter slots to return only those not booked
    const availableSlots = appointmentDoc.slots.filter(slot => !slot.isBooked);

    console.log(availableSlots, 'Available Slots');

    res.status(200).json({
      doctorId: appointmentDoc.doctorId,
      doctorName: appointmentDoc.doctorName,
      availableSlots,
    });
  } catch (error) {
    next(error);
  }
};

exports.joinSlot = async (req, res, next) => {
  const { time, doctorId } = req.body;

  // Validate required parameters
  if (!time || !doctorId) {
    return res.status(400).json({ message: 'time and doctorId are required.' });
  }

  try {
    // Find the doctor and slot by doctorId and time, project only the matched slot
    const doc = await AvailableAppointment.findOne(
      { doctorId, 'slots.time': time },
      { 'slots.$': 1 }
    );

    // If no matching slot found, return 404
    if (!doc || !doc.slots || doc.slots.length === 0) {
      return res.status(404).json({ message: 'No matching slot found.' });
    }

    const slot = doc.slots[0];

    // If slot is already unbooked (false), user can't join again, consider session expired
    if (slot.isBooked === false) {
      return res.status(400).json({ message: 'Session was already joined and Session is expired!' });
    }

    // Update the slot to mark it as unbooked (free)
    const updatedDoc = await AvailableAppointment.updateOne(
      { doctorId, 'slots.time': time },
      { $set: { 'slots.$.isBooked': false } }
    );

    // If no document was modified, means no matching slot or already booked
    if (updatedDoc.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching slot found or already booked.' });
    }

    // Success response for joining slot
    return res.status(200).json({ message: 'Joined successfully' });
  } catch (err) {
    console.error('Join failed:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
