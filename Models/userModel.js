import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true

    },

    rollno:{
        type:Number,
        required: true,

    },

    branch:{
        type: String,
        required: true,
        enum: ['CSE','CSE(AIML)','CSE(DS)','CS(H)','CS','CSIT','IT','ECE','ME','Civil','MCA']
        
    },
    
    email:{
        type: String,
        required: true,
        unique: true,

        validate: {
            validator: function (value) {
              return /^[a-z]+[0-9]+@akgec\.ac\.in$/.test(value);
            },
            message: 'Invalid email format or does not belong to akgec.ac.in domain'
          }
    },

    password:{
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value.length >= 8 && 
               /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+=])/.test(value);
      },
      message: 'Password must be at least 8 characters and include a digit, lowercase letter, uppercase letter, and symbol'
    }
    },
    otp:{
        type: Number,
        required: true,
    },
    token:{
        type: String,
        default: ''
    }

})

const userModel = mongoose.model("userLogin",userSchema)
export default userModel;