import User from "../models/userModel";

const getUserByEmail = async (email) => {
  if (!email) {
    return null;
  }
  const user = await User.findOne({ email });
  return user;
};

const create = async (...data) => {
  if (data) {
    return await User.create(...data);
  }
  return null;
};
const findByUsername = async (username) => {
  try {
    const user = await User.findOne({ username: username });
    return user;
    console.log("user", user);
  } catch (error) {
    return null;
  }
};
const getUserById = async (id) => {
  let user = null;
  if (id) {
    const user = await User.findOne({ _id: id });
    user.password = "";
    return user;
  }

  return user;
};

export { getUserByEmail, create, getUserById, findByUsername };
