import { ObjectId } from "mongodb";
import {
  getAllPost,
  createPost,
  findById,
  deletePost,
  updatePost,
} from "../respositories/postRepository.js";
import responseData from "../helpers/responseData.js";
import Post from "../models/postModel.js";

const getAll = (req, res) => {
  const { page, rowPerpage, search ,sort} = req?.body;
  let curentPage = page >= 1 ? parseInt(page) : 1;
  let limit = rowPerpage >= 1 ? parseInt(rowPerpage) : 16;
  const searchQuery = search
    ? { title: { $regex: search, $options: "i" } }
    : {};
  let typeSort = -1
  switch (sort) {
    case 'oldest':
      typeSort = 1;
      break;
  
    default:
      break;
  }
  Post.find(searchQuery)
    .skip((curentPage - 1) * limit)
    .limit(limit)
    .sort([['createdAt', typeSort]])
    .exec((err, posts) => {
      Post.count().exec((err, count) => {
        return responseData({
          res: res,
          data: {
            posts: posts,
            page: curentPage,
            total: Math.ceil(count / limit),
            rowPerpage: limit,
          },
          message: "thành công",
          status: "200",
        });
      });
    });
};

const create = async (req, res) => {
  const { title, content } = req?.body;
  const { user_id } = req?.user;
  if (!user_id) {
    return responseData({
      res: res,
      data: null,
      message: "Thêm mới không thành công",
      status: 400,
    });
  }
  const id = new ObjectId(user_id);
  const post = await createPost({ content: content, title: title, author: id });
  if (post) {
    return responseData({
      res: res,
      data: post,
      message: "thành công",
      status: 201,
    });
  }
  return responseData({
    res: res,
    data: null,
    message: "không thành công",
    status: 500,
  });
};

const update = async (req, res) => {
  const { title, content, id } = req?.body;

  const { user_id } = req?.user;
  if (!user_id) {
    return responseData({
      res: res,
      data: null,
      message: "Không thể cập nhật",
      status: 400,
    });
  }
  const post = await updatePost({
    title: title,
    content: content,
    author: new ObjectId(user_id),
    id: new ObjectId(id),
  });
  if (post) {
    return responseData({
      res: res,
      data: post,
      message: "Cập nhật thành công",
      status: 200,
    });
  } else {
    return responseData({
      res: res,
      data: null,
      message: "Không thể cập nhật",
      status: 400,
    });
  }
};

const distroy = async (req, res) => {
  const { id } = req?.body;
  const post = deletePost(new ObjectId(id));
  if (post) {
    return responseData({
      res: res,
      data: post,
      message: "Xoá thành công",
      status: 200,
    });
  } else {
    return responseData({
      res: res,
      data: null,
      message: "Không thể Xoá",
      status: 400,
    });
  }
};

export default {
  getAll,
  create,
  update,
  distroy,
};
