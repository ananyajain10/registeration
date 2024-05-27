import userQuizDetails from "../Models/userQuizDetails.js";
import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const createQuizDetails = async (req, res) => {
  try {
    // Extract user ID from JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.id;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { selectedAnswers, score } = req.body;

    const newUserQuizDetails = new userQuizDetails({
      user: userId,
      selectedAnswers: selectedAnswers,
      score: score,
    });

    const savedUserQuizDetails = await newUserQuizDetails.save();

    res.status(201).json(savedUserQuizDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default createQuizDetails;
