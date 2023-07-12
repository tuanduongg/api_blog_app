import express from "express";
import { authController } from "../controllers/index.js";
import { body } from "express-validator";
const router = express.Router();

const validateSignUp = [
  body("username")
    .notEmpty().withMessage("không được để trống tên tài khoản"),
  body("password").notEmpty().withMessage("không được để trống mật khẩu"),
];


const validateLogin = [
  body("username")
    .notEmpty().withMessage("không được để trống tên tài khoản"),
  body("password").notEmpty().withMessage("không được để trống mật khẩu"),
];
router.post("/login",validateLogin, authController.handleLogin);
router.post("/signup", validateSignUp, authController.handleSignUp);
router.post("/check-user", authController.checkUserById);

export default router;
