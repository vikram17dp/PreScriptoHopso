import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.docId = decoded.id;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authorization Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authDoctor;
