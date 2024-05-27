import express from 'express'

import { login,  sendOtp, verifyOtpAndRegister, forgetpassword , resetpassword, updatepassword} from '../Controllers/loginController.js'

const router = express.Router()

router.post('/login',login);

router.post('/sendOtp',sendOtp);
router.post('/verifyOtpAndRegister',verifyOtpAndRegister);
router.post('/forgetpassword', forgetpassword)
router.get('/resetpassword', resetpassword)
router.post('/updatepassword', updatepassword)

export default router