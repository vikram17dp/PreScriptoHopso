import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import Stripe from 'stripe'

export const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 4) {
      return res.json({ success: false, message: "Enter a strong pasword" });
    }
    const salt = await bcrypt.genSalt(10);
    const hasedpassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hasedpassword,
    };
    const newuser = new userModel(userData);
    const user = await newuser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, image } = req.body;
    if (!name || !email || !image) {
      return res.status(400).json({
        success: false,
        message: "Missing details from Google sign-in",
      });
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      const newUser = new userModel({
        name,
        email,
        image: image,
        authMethod: "google",
      });

      user = await newUser.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Google Authentication Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, address, phone, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !address || !phone || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
      return res.json({
        success: true,
        message: "image updated successfully!",
      });
    }
    res.json({ success: true, message: "profile updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };
    const newappointment = new appointmentModel(appointmentData);
    await newappointment.save();
    await doctorModel.findByIdAndUpdate(docData, { slots_booked });
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const myAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "unauthorized action " });
    }
    await appointmentModel.findByIdAndUpdate(appointmentData, {
      cancelled: true,
      payment:false
    });
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appoitment Cancelled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({ success: false, message: "Appointment not found or cancelled" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointmentData.amount * 100), // Ensure the amount is an integer
      currency: process.env.CURRENCY || 'inr',
      metadata: { appointmentId },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// This is your updated updatePaymentStatus function
export const updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId, paymentIntentId } = req.body; // Get paymentIntentId from the request body
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update the appointment fields
    appointment.payment = true; // Mark payment as done
    // appointment.isCompleted = true;
     // Mark appointment as completed
    appointment.status = true

    // Save the updated appointment
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment updated successfully",
      appointment: {
        id: appointment._id,
        amount: appointment.amount,
        isCompleted: appointment.isCompleted,
        payment: appointment.payment,
        status:appointment.status
      },
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
