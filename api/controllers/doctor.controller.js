import doctorModel from "../models/doctor.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointment.model.js";

export const changeAvailblity = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
    res.json({ success: true, message: "Availability updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const appointmentDoctor = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const appointmentComplete = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (appointment && appointment.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({ success: false, message: "Mark failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const appointmentCancel = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (appointment && appointment.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const dashboardDoctor = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.forEach(item => {
      if (item.isCompleted || item.payment) earnings += item.amount;
    });

    let patients = [];
    appointments.forEach(item => {
      if (!patients.includes(item.userId)) patients.push(item.userId);
    });

    const dashdata = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestappointment: appointments.slice().reverse().slice(0, 5),
    };
    res.json({ success: true, dashdata });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getdoctorprofile = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const profiledata = await doctorModel.findById(docId).select('-password');
    res.json({ success: true, profileData: profiledata });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const docId = req.userId;                          // ← was req.body.docId
    const { fees, available, address } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, available, address });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPrescription = async (req, res) => {
  try {
    const { appointmentId, prescription } = req.body;

    if (!appointmentId || !prescription?.trim()) {
      return res.status(400).json({ success: false, message: 'appointmentId and prescription are required' });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appointment.docId !== req.userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (appointment.cancelled) return res.status(400).json({ success: false, message: 'Cannot prescribe for cancelled appointment' });

    appointment.prescription = prescription.trim();
    appointment.isCompleted = true;
    await appointment.save();

    return res.json({ success: true, message: 'Prescription added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    if (!appointmentId) return res.status(400).json({ success: false, message: 'appointmentId is required' });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appointment.docId !== req.userId) return res.status(403).json({ success: false, message: 'Not authorized' });

    return res.json({ success: true, prescription: appointment.prescription, isCompleted: appointment.isCompleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};