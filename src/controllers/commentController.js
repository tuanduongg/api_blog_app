import { ObjectId } from "mongodb";
import responseData from "../helpers/responseData";
import {
  createComment,
  deleteComment,
  getAllCommentPost,
  updateComment,
} from "../respositories/commentRepository";
const getByIdPost = async (req, res) => {
  const { id } = req?.body;
  if (id) {
    const data = await getAllCommentPost(new ObjectId(id));
    if (data) {
      return responseData({
        res,
        message: "Thành công",
        status: 200,
        data: data,
      });
    }
  }
  return responseData({
    res,
    message: "Không có dữ liệu",
    status: 400,
    data: null,
  });
};

const create = async (req, res) => {
  const { user_id } = req?.user;

  const { parent_id, post_id, content } = req?.body;
  if (post_id && content && user_id) {
    const obj = {
      parent_id: parent_id ? new ObjectId(parent_id) : null,
      post_id: new ObjectId(post_id),
      content,
      user_id: new ObjectId(user_id),
    };
    //comment con
    const comment = await createComment(obj);
    if (comment) {
      return responseData({
        res,
        message: "Bình luận thành công",
        status: 201,
        data: comment,
      });
    }
  }
  return responseData({
    res,
    message: "Không thể bình luận",
    status: 400,
    data: null,
  });
};
const update = async (req, res) => {
  const { user_id } = req?.user;

  const { id, content } = req?.body;
  if (id) {
    const obj = {
      id: id,
      content,
      user_id,
    };
    //comment con
    const comment = await updateComment(obj);
    if (comment) {
      return responseData({
        res,
        message: "Chỉnh sửa bình luận thành công",
        status: 200,
        data: comment,
      });
    }
  }
  return responseData({
    res,
    message: "Không thể bình luận",
    status: 400,
    data: null,
  });
};

const distroy = async (req, res) => {
  const { id } = req?.body;
  const { user_id } = req?.user;
  const data = await deleteComment({ id, user_id });
  if (data) {
    return responseData({
      res,
      message: "Xoá bình luận thành công",
      status: 200,
      data: {},
    });
  }
  return responseData({
    res,
    message: "Không thể xoá bình luận",
    status: 400,
    data: null,
  });
};

export default {
  getByIdPost,
  create,
  update,
  distroy,
};
