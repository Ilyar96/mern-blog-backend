import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";

import mongoose from "mongoose";

import {
  loginValidation,
  commentValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";

import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";

import { checkAuth, handleValidationError } from "./utils/index.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch(() => console.log("DB error"));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors()); //*позволяет стороннему домену делать запрос к нему
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationError,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationError,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.update
);

app.get("/comments", CommentController.getComments);
app.get("/comments/:postId", CommentController.getAllCommentsByPost);
app.post(
  "/comments",
  checkAuth,
  commentValidation,
  handleValidationError,
  CommentController.createComment
);
app.delete(
  "/comment/:commentId",
  checkAuth,
  CommentController.removeByCommentId
);
app.delete("/comments/:postId", checkAuth, CommentController.removeByPostId);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server ok");
});
