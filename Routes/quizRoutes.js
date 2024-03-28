import express from 'express';

import  createQuizDetails from '../Controllers/quizDetailsController.js';

const router = express.Router();

router.post('/createQuizDetails',  createQuizDetails);

export default router;