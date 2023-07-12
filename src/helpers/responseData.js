const responseData = ({ res, data = [], message = "", status = 200 }) => {

  if (!res) {
    console.log("not found response!");
    return null;
  }
  status = parseInt(status);
  return res.status(status).json({ data: data, message: message,statusCode:status });
};

export default responseData;
