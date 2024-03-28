import mongoose from 'mongoose';

const userQuizDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
       
      },
      selectedAnswers: [{
        question: {
          type: Number,
          required: true
        },
        selectedOption: {
          type: Number,
          required: true
        },
        isCorrect: {
          type: Boolean,
          required: true
        }
      }],
      score: {
        type: Number,
        required: true
      }
    });
    
    const userQuizDetails = mongoose.model('UserQuizDetailsSchema', userQuizDetailsSchema);
    
    export default userQuizDetails;