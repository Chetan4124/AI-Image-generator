import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not authorised, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      
      req.user = { id: decoded.id };
      next();
    } else {
      return res.json({ success: false, message: "Not authorised, invalid token" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;


 
