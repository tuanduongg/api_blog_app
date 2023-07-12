import jwt from "jsonwebtoken";
import { findById } from "../respositories/postRepository";
import { ObjectId } from "mongodb";

const config = process.env;

const verifyToken = (req, res, next) => {
  //   const token = req.headers["x-access-token"];
  const token =req?.headers?.authorization;

  if (!token) {
    return res.status(403).send("Không có token!");
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(403).send("Invalid Token!");
  }
  return next();
};

const canDistroyPost = async (req, res, next) => {
  const { id } = req?.body;
  if (!id) {
    return res.status(400).send("ID là bắt buộc");
  }
  const token =req?.headers?.authorization;

  if (!token) {
    return res.status(403).send("Không có token!");
  }
  try {
    const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user = user;
    const post = await findById(new ObjectId(id));
    if (!post) {
      return res.status(400).send("Không tìm thấy bài viết");
    }
    if (user?.role === "admin" || user?.user_id === post?.author.toString()) {
      next();
      return;
    }else {
      return res.status(403).send("Bạn không có quyền truy cập");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token!");
  }
};

export { verifyToken, canDistroyPost };
