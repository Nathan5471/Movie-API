import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const token = jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: "30d",
  });
  return token;
};

export default generateToken;
