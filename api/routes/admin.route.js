import express from 'express'

import { addDoctor,allappointments,alldoctors,loginAdmin} from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailblity } from '../controllers/doctor.controller.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors',authAdmin,alldoctors);
adminRouter.post('/change-availblity',authAdmin,changeAvailblity)
adminRouter.get('/appointments',authAdmin,allappointments)

export default adminRouter;