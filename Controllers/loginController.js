import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import "dotenv/config.js";
import otpModel from "../Models/otp.js";
import Randomstring from "randomstring";
import express from 'express';

const app = express();
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
          { expiresIn: "24h" }
        );
        res.status(200).json({ result: user, token });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

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
        res.status(400).json({ message: error.message });
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const newOtp = await otpModel.findOne({ email: email });
    if (newOtp) {
      await otpModel.deleteOne({ email: email });
      await otpModel({ email, otp });
    } else {
      const newOtp = new otpModel({ email, otp });
      await newOtp.save();
    }
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp } = req.body;
  const emailExist = await otpModel.findOne({ email: email, otp: otp });
  try {
    if (!emailExist) {
      return res.status(400).json({ message: "Invalid OTP or Email" });
    }

    if (emailExist.otp == otp) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      const newUser = new userModel(req.body);

      try {
        const oldUser = await userModel.findOne({ email: email });

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
      } catch (error) {
        res.status(500).json({ message: error.message });
      }

      await otpModel.deleteOne({ email: email });
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
      valid = false;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPasswordMail = async (name, email, token) => {
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
      subject: "Reset Your GDSC-QUIZ Password",
      html: `<p>Hey! ${name}, Please use the attached link to <a href="http://localhost:3000/auth/resetpassword?token=${token}"> reset the password </a> </p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false, msg: error.message });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message)
  }
};

export const forgetpassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.findOne({ email: email });
    if (user) {
      const randomString = Randomstring.generate();
      await userModel.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      resetPasswordMail(user.name, user.email, randomString);
      res.status(200).send({
        success: true,
        msg: "Please check your inbox to reset the password",
      });
    } else {
      res.status(200).send({ success: true, msg: "Email does not exists" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

export const resetpassword = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await userModel.findOne({ token: token });
    if (tokenData) {
      res.render("resetpass", { token });
    } else {
      res
        .status(200)
        .send({ success: false, msg: "This link has been expired" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

export const updatepassword = async (req, res) => {
  try {
    const newpassword =  req.body.newPassword;
    const confirmpassword =  req.body.confirmPassword;
    if (newpassword == confirmpassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      console.log(hashedPassword)
      const tokenData = await userModel.findOne({token: req.body.token});
     
      const userNewPass = await userModel.findByIdAndUpdate(
       
        {_id : tokenData._id} ,
        { $set: { password: hashedPassword, token: '' } },
        { new: true }
      );
      
      if (userNewPass) {
        res.status(200).send({ success: true, msg: "User Password has been reset", data: userNewPass });
      }
        else{
          return res.status(400).send({ success: true, msg: 'Invalid token or user not found' });
        }
      

     
    } else {
      res.status(400).send("Passwords do not match");
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
};
