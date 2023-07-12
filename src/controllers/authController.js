import User from "../models/userModel";
import responseData from "../helpers/responseData";
import jwt from "jsonwebtoken";
import {
  findByUsername,
  create,
  getUserById,
} from "../respositories/userRepository.js";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import { generateAccessToken } from "../helpers/generateToken.js";

const NUM_SALT_ROUNDS = 8;
const oneYearInSeconds = 365 * 24 * 60 * 60;

const handleLogin = async (req, res) => {
  const { password, username } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(responseData({ data: errors.array(), status: 400 }));
  }
  try {
    const user = await findByUsername(username);
    if (user && bcryptjs.compareSync(password, user.password)) {
      const token = user?.token;
      if (!token) {
        const token = generateAccessToken({
          user_id: user._id,
          username,
          role: user.role,
        });
        user.token = token;
      }
      const { password, ...more } = user._doc;
      res.cookie("authToken", token, {
        expires: new Date(Date.now() + oneYearInSeconds * 1000),
        httpOnly: true,
      });
      return responseData({
        res: res,
        data: { ...more },
        message: "Đăng Nhập Thành công!",
        status: 200,
      });
    }
    return responseData({
      res: res,
      message: "Tài khoản hoặc mật khẩu không chính xác!",
      status: 400,
    });
  } catch (error) {
    return responseData({
      res: res,
      data: error,
      message: error.message,
      status: 500,
    });
  }
};

const handleSignUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(responseData({ data: errors.array(), status: 400 }));
  }
  const { username, password } = req.body;

  const isExcistUser = await findByUsername(username);
  if (isExcistUser) {
    return responseData({
      res: res,
      message: "Tên tài khoản đã tồn tại",
      status: 400,
    });
  }

  const hashedPass = await bcryptjs.hash(password, NUM_SALT_ROUNDS);
  const user = new User({
    username,
    password: hashedPass,
  });
  const token = generateAccessToken({
    user_id: user._id,
    username,
    role: user.role,
  });
  user.token = token;
  delete user.password;
  const newUser = await create(user);
  res.cookie("authToken", token, {
    expires: new Date(Date.now() + oneYearInSeconds * 1000),
    httpOnly: true,
  });
  return responseData({
    res: res,
    data: newUser,
    status: 201,
    message: "created",
  });
};

const checkUserById = async (req, res) => {
  const { id } = req?.body;
  if (id) {
    const data = await getUserById(id);
    return responseData({
      res: res,
      data: data,
      status: 200,
      message: "success",
    });
  }
  return responseData({
    res: res,
    data: null,
    status: 400,
    message: "không tìm thấy!",
  });
};

export default {
  handleLogin,
  handleSignUp,
  checkUserById,
};
