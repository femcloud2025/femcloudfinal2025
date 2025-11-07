import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers['authorization']; // standard header

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    // Assuming token is like: "Bearer <token>"
    const realToken = token.split(" ")[1];

    const decoded = jwt.verify(realToken, process.env.JWT_SECRET);

    // Check payload contains admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
  }
};

export default adminAuth;
