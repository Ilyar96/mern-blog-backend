import express from "express";
import mongoose from "mongoose";

import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

//! Обясняем, что хотим использовать mongodb (ключ получаем из базы данных - Connect to Cluster0 (не забыть указать актуальный пароль пользователя))
//* Добавили после .mongodb.net blog и mongo db автоатически создал БД blog. Также сам определил, что есть таблица users и создал его
mongoose
  .connect(
    "mongodb+srv://admin:d-wV5GKCQqbb_6g@cluster0.0qmzkcs.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch(() => console.log("DB error"));

const app = express();

//! Позволяет читать json? который будет приходить в наших запросах
app.use(express.json());

app.post("/auth/login", UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

//! Запускаем сервер. Вторым параметром задаем функцию, которая объясняет, что если наш сервер не смог запуститься, то мы вернем сообщение об этом - app.use(express.json());
app.listen(4444, (err) => {
  if (err) {
    return console.log(error);
  }

  console.log("Server ok");
});
