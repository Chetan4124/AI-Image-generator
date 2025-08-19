import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const newUser = new userModel(userData);
    const User = await newUser.save();

 const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);


    res.json({ success: true, token, user: { name: User.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: user.name } });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// CREDITS
const userCredits = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ take from req.user, not body

    const User = await userModel.findById(userId);

    if (!User) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: User.creditBalance,
      user: { name: User.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }

  console.log()
};

export { registerUser, loginUser, userCredits };
