import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import "dotenv/config.js";
import otpModel from "../Models/otp.js";

export const register = async (req, res) => {
 
  const salt = await bcrypt.genSalt(10);
  const hashedPassward = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassward;

  const newUser = new userModel(req.body);
  const { name, rollno, branch, email } = req.body;

  try {
    const oldUser = await userModel.findOne({ email: email })
        

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    } 

    const user = await newUser.save();
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.TOKEN,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User created successfully" });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }


};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (validity) {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.TOKEN,
          { expiresIn: "1h" }
        );
        res.status(200).json({ result: user, token });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 


// otp controller


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  const newOtp = await otpModel.create({ email, otp });

 

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for verification",
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const valid = false;
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const emailExist = await otpModel.findOne({ email }); 
  try {
    if (emailExist.otp == otp) {
      
      res.status(200).json({ message: "OTP verified successfully" });
      valid = true;
    } else {
      res.status(400).json({ message: "Invalid OTP" });
      valid = false;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  await otpModel.deleteOne({email: email});
};
