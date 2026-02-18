import express from 'express'
import authDoctor from '../middlewares/authDoctor.js'
import {
  appointmentCancel,
  appointmentComplete,
  appointmentDoctor,
  dashboardDoctor,
  doctorList,
  getdoctorprofile,
  loginDoctor,
  updateProfileData,
  addPrescription,
  getDoctorPrescription,
} from '../controllers/doctor.controller.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',                    doctorList)
doctorRouter.post('/login',                  loginDoctor)
doctorRouter.get('/appointments',            authDoctor, appointmentDoctor)
doctorRouter.post('/complete-appointment',   authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment',     authDoctor, appointmentCancel)
doctorRouter.get('/dashboard',               authDoctor, dashboardDoctor)
doctorRouter.get('/profile',                 authDoctor, getdoctorprofile)
doctorRouter.post('/update-profile',         authDoctor, updateProfileData)
doctorRouter.post('/add-prescription',       authDoctor, addPrescription)
doctorRouter.get('/get-prescription',        authDoctor, getDoctorPrescription)

export default doctorRouter