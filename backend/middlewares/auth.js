import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // Accept either `token` header or `Authorization: Bearer <token>`
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  let token = req.headers.token || authHeader;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorised, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded && decoded.id) {
      req.user = { id: decoded.id };
      return next();
    }

    return res.status(401).json({ success: false, message: "Not authorised, invalid token" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorised, token invalid or expired" });
  }
};

export default userAuth;


 
