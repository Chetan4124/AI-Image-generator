import axios from "axios";
import userModel from "../models/usermodel.js";
import FormData from "form-data";

const generateImage = async (req, res) => {
  try {
  const { prompt } = req.body;

    
    const userId = req.user.id;

    const User = await userModel.findById(req.user.id);

    if(!userId){
        return res.json({success:false,message:'Missing useer id'})
    }

    if ( !prompt) {
      return res.json({ success: false, message: "Missing prompt" });
    }

    if (User.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: User.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
         
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct one credit
    await userModel.findByIdAndUpdate(User._id, {
      creditBalance: User.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image generated successfully",
      image: resultImage,
      creditBalance: User.creditBalance - 1,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default generateImage;

