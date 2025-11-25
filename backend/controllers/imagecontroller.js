import axios from "axios";
import userModel from "../models/usermodel.js";
import FormData from "form-data";

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Validate user authentication first
    if (!req.user || !req.user.id) {
      return res.json({ success: false, message: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    
    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.json({ success: false, message: "Missing or invalid prompt" });
    }
    
    // Check if user exists
    const User = await userModel.findById(userId);
    if (!User) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    // Check credit balance
    if (User.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: User.creditBalance,
      });
    }
    
    // Validate API key
    if (!process.env.CLIPDROP_API) {
      return res.json({ success: false, message: 'API key not configured' });
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append("prompt", prompt.trim());
    
    // Make API request
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1", // Verify this URL
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(), // Important: Include form data headers
        },
        responseType: "arraybuffer",
        timeout: 30000, // 30 second timeout
      }
    );
    
    // Convert to base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;
    
    // Deduct one credit
    const updatedUser = await userModel.findByIdAndUpdate(
      User._id, 
      { creditBalance: User.creditBalance - 1 },
      { new: true } // Return updated document
    );
    
    res.json({
      success: true,
      message: "Image generated successfully",
      image: resultImage,
      creditBalance: updatedUser.creditBalance,
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    
    // Handle specific error types
    if (error.response) {
      // API responded with error status
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
      
      return res.json({ 
        success: false, 
        message: `API Error: ${error.response.status}` 
      });
    } else if (error.request) {
      // Request was made but no response received
      return res.json({ 
        success: false, 
        message: 'Network error - no response from image generation service' 
      });
    } else {
      // Other errors
      return res.json({ 
        success: false, 
        message: 'Image generation failed' 
      });
    }
  }
};

export default generateImage;

