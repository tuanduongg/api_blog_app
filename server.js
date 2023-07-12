import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from "express";
import { postRouter, authRouter,commentRouter } from "./src/routes/index.js";
import connect from "./src/database/connectDb.js";
import cookieParser from "cookie-parser";
import cors  from 'cors';

const app = express();

app.use(cors());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_CLIENT);
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE,OPTIONS"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
    "Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST;

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.listen(PORT, process.env.HOST, async () => {
  await connect();
  console.log(`app is running at ${HOST}:${PORT}/`);
});
