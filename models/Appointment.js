import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    service: { type: String, default: 'General Consultation' },
    doctor: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    meetLink: { type: String, default: '' },
    doctorResponse: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
