import express from 'express'

import { login, register, sendOtp, verifyOtp } from '../Controllers/loginController.js'

const router = express.Router()

router.post('/login',login);
router.post('/register',register);
router.post('/sendOtp',sendOtp);
router.post('/verifyOtp',verifyOtp);

export default router