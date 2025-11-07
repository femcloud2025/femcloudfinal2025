import jwt from 'jsonwebtoken'

export const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};


export const authSeller = async (req, res, next) => {


   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
       return res.status(401).json({ success: false, message: "No token provided" });
   }

   const token = authHeader.split(" ")[1];

   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.sellerId = decoded.id;
       next();
   } catch (error) {
       console.error("Token verification failed:", error);
       res.status(401).json({ success: false, message: "Invalid or expired token" });
   }
};


