import Post from "../models/postModel";

const getAllPost = async (search, page, rowPerpage) => {
  const searchQuery = search
    ? { title: { $regex: search, $options: "i" } }
    : {};
  Post.find(searchQuery)
    .skip((page - 1) * rowPerpage)
    .limit(rowPerpage)
    .exec((err, posts) => {
      Post.count().exec((err, count) => {
        return {
          posts: posts,
          page: page,
          total: Math.ceil(count / rowPerpage),
        };
      });
    });
  return data;
};

const findById = async (id) => {
  if (id) {
    const post = await Post.findOne({ _id: id });
    return post;
  }
  return null;
};

const createPost = async (...data) => {
  if (data) {
    try {
      return await Post.create(...data);
    } catch (error) {
      return null;
    }
  }
  return null;
};

const updatePost = async (data) => {
  if (data) {
    const { title, content, author, id } = data;
    try {
      const result = await Post.updateOne(
        { _id: id, author: author },
        {
          $set: {
            title: title,
            content: content,
            updatedAt: Date.now(),
          },
        }
      );
      if (parseInt(result?.modifiedCount) > 0) {
        return data;
      }
      return null;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

const deletePost = async (id) => {
  if (!id) return null;
  try {
    const result = await Post.deleteOne({ _id: id });
    if (parseInt(result?.deletedCount) > 0) {
      return id;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export { getAllPost, createPost, findById, updatePost, deletePost };
