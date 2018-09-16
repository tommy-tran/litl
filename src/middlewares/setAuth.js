import jwt from "jsonwebtoken";
import config from "../config/config";

export default async (req, res, next) => {
  const token = req.get("x-auth-token");
  if (!token) return next();

  try {
    const payload = await jwt.verify(token, config.JWT_PRIVATE_KEY);
    req.user = payload.user;
  } catch (err) {
    // JWT expired
    req.user = undefined;
  }
  next();
};
