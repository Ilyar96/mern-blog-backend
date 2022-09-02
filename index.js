import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";

import { UserController, PostController } from "./controllers/index.js";

import { checkAuth, handleValidationError } from "./utils/index.js";

//! Обясняем, что хотим использовать mongodb (ключ получаем из базы данных - Connect to Cluster0 (не забыть указать актуальный пароль пользователя))
//* Добавили после .mongodb.net blog и mongo db автоатически создал БД blog. Также сам определил, что есть таблица users и создал его
mongoose
  .connect(
    "mongodb+srv://admin:d-wV5GKCQqbb_6g@cluster0.0qmzkcs.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch(() => console.log("DB error"));

const app = express();

//! Создаем хранилище, где будем сохранять картинки
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    //? Функция destination должна сказать, что она не получает никаких ошибок (null) и объясняет, что нужно сохранить те файлы, которые будем загружать в папку uploads. То есть объясняет, какую путь использвать
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//! Позволяет читать json? который будет приходить в наших запросах
app.use(express.json());
//! Если перейти по адресу http://localhost:4444/uploads/<Название картинки>, то будет ошибка (так как express думает, что делается get-запрос на какой-то route? но он пробегается по каждому route, понимает, что нет нужного route и вернет 404). Для объяснения express, что есть специальная папка в которой хранятся статичные файлы (express-приложение должен проверить, что если придет запрос на /uploads, то из библиотеки express при помощи функции static проверяй: есть ли в этой папке то,что я передаю):
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

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
}); //Указываем, что ожидаем файл под названием image

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.create
); // Сначала ожидается выполнение checkAuth
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.update
);

//! Запускаем сервер. Вторым параметром задаем функцию, которая объясняет, что если наш сервер не смог запуститься, то мы вернем сообщение об этом - app.use(express.json());
app.listen(4444, (err) => {
  if (err) {
    return console.log(error);
  }

  console.log("Server ok");
});
