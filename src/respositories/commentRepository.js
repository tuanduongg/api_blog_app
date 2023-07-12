import { ObjectId } from "mongodb";
import Comment from "../models/commentModel";

const getAllCommentPost = async (idPost) => {
  const data = await Comment.aggregate([
    {
      $match: { post_id: idPost },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$_id",
        parent_id: "$parent_id",
        user_id: "$user_id",
        post_id: "$post_id",
        content: "$content",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        user_name: "$user.username",
      },
    },
  ]);
  return data;
};

const createComment = async (data) => {
  const { parent_id, user_id, post_id, content } = data;
  if (data) {
    try {
      const comment = new Comment();
      comment.parent_id = parent_id;
      comment.user_id = user_id;
      comment.post_id = post_id;
      comment.content = content;
      await comment.save();
      return comment;
    } catch (error) {
      return null;
    }
  }
  return null;
};

const updateComment = async (data) => {
  const { id, content, user_id } = data;
  try {
    const result = await Comment.updateOne(
      { _id: new ObjectId(id), user_id: new ObjectId(user_id) },
      {
        $set: {
          content: content,
          updatedAt:  Date.now(),
        },
      }
    );
    console.log("result", result);
    if (parseInt(result?.modifiedCount) > 0) {
      return data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const deleteComment = async (data) => {
  const { id, user_id } = data;
  if (!id) {
    return null;
  }
  try {
    const result = await Comment.findOne({ _id: id, user_id });

    if (result) {
      const data = result;
      result.deleteOne();
      return data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export { getAllCommentPost, createComment, updateComment, deleteComment };
