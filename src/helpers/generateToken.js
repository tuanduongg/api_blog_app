import jwt from "jsonwebtoken";

const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.EXPIRES_TOKEN || "365days",
  });
  return token;
};

export {
  generateAccessToken,
};
