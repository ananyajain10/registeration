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
                return value.length >= 6;
            },
            message: 'Password must be greater than 6 characters'
        }
    },
    otp:{
        type: Number,
        required: true,
    }

})

const userModel = mongoose.model("userLogin",userSchema)
export default userModel;