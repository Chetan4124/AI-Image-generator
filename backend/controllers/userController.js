import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    // check if user already exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const newUser = new userModel(userData);
    const User = await newUser.save();

    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user: { name: User.name, email: User.email } });
  } catch (error) {
    console.log(error);
    // handle duplicate key error more explicitly
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password' });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREDITS
const userCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const User = await userModel.findById(userId);

    if (!User) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: User.creditBalance,
      user: { name: User.name, email: User.email },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, userCredits };
