import express from 'express'

import { login,  sendOtp, verifyOtpAndRegister } from '../Controllers/loginController.js'

const router = express.Router()

router.post('/login',login);

router.post('/sendOtp',sendOtp);
router.post('/verifyOtpAndRegister',verifyOtpAndRegister);

export default router