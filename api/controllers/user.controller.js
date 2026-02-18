import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing Details" });
    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Enter a valid email" });
    if (password.length < 4)
      return res.json({ success: false, message: "Enter a strong password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, image } = req.body;
    if (!name || !email || !image)
      return res.status(400).json({ success: false, message: "Missing details from Google sign-in" });

    let user = await userModel.findOne({ email });
    if (!user) {
      user = await new userModel({ name, email, image, authMethod: "google" }).save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, image: user.image },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, address, phone, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !address || !phone || !dob || !gender)
      return res.status(400).json({ success: false, message: "Missing details" });

    await userModel.findByIdAndUpdate(req.userId, {
      name, phone, dob, gender,
      address: JSON.parse(address),
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      await userModel.findByIdAndUpdate(req.userId, { image: imageUpload.secure_url });
      return res.json({ success: true, message: "Image updated successfully!" });
    }
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available)
      return res.status(400).json({ success: false, message: "Doctor not available" });

    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime))
        return res.json({ success: false, message: "Slot already booked" });
      slots_booked[slotDate].push(slotTime);
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");
    const appointmentData = {
      userId,
      docId,
      userData,
      docData: { ...docData.toObject(), slots_booked: undefined },
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    await new appointmentModel(appointmentData).save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const myAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId });
    res.json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData)
      return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appointmentData.userId !== req.userId)
      return res.status(403).json({ success: false, message: "Unauthorized action" });

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, payment: false });

    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ paymentStripe — was accidentally removed, now restored
export const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled)
      return res.status(400).json({ success: false, message: "Appointment not found or cancelled" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointmentData.amount * 100),
      currency: process.env.CURRENCY || "inr",
      metadata: { appointmentId },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    appointment.payment = true;
    await appointment.save();
    res.json({ success: true, message: "Payment status updated", appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    if (!appointmentId)
      return res.status(400).json({ success: false, message: "appointmentId is required" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appointment.userId !== req.userId)
      return res.status(403).json({ success: false, message: "Not authorized" });

    return res.json({
      success: true,
      prescription: appointment.prescription,
      isCompleted: appointment.isCompleted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};