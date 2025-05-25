import jwt from "jsonwebtoken";

const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Prevent CSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    domain: process.env.NODE_ENV === "production" ? ".hostingersite.com" : undefined, // Set domain for production
  });
};

export default createJWT;
