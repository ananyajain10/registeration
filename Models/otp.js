import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,

        validate: {
            validator: function (value) {
              return /^[a-zA-Z0-9._-]+@akgec\.ac\.in$/.test(value);
            },
            message: 'Invalid email format or does not belong to akgec.ac.in domain'
          }
    },

    otp:{
        type: Number,
        required: true,
        
    }
});

 const otpModel = mongoose.model("otp",otpSchema);
 export default otpModel;