import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//! Обясняем, что хотим использовать mongodb (ключ получаем из базы данных - Connect to Cluster0 (не забыть указать актуальный пароль пользователя))
mongoose
  .connect(
    "mongodb+srv://admin:d-wV5GKCQqbb_6g@cluster0.0qmzkcs.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch(() => console.log("DB error"));

const app = express();

//! Позволяет читать json? который будет приходить в наших запросах
app.use(express.json());

//! Если на приложение придет get-запрос на главный путь, то выполняем команду(функцию)
//*req - что прислал клиент
//*res - что передадим клиенту мы
app.get("/", (req, res) => {
  //Возвращаем клинту сообщение
  res.send("<h1>Hello world!</h1>");
});

app.post("/auth/login", (req, res) => {
  //! В req получаем json лбъект, но наше express-приложение не знает что такое json, чтобы научить читать json -запросы, которые мы будем отправлять
  console.log(req.body);

  //! Генерируем токен jwt.sign(). В качестве 1 параметра можем передать информацию, которую можем шифровать. 2 параметр -ключ, при помощи которого шифруем/ Потом токен возвращаем к клиенту. Жтот токен можно расшифровать в https://jwt.io/
  if (req.body.email === "test@test.ru") {
    const token = jwt.sign(
      {
        email: req.body.email,
        fullName: "Вася Пупкин",
      },
      "secret123"
    );
  }

  res.json({
    success: true,
    token,
  });
});

//! Запускаем сервер. Вторым параметром задаем функцию, которая объясняет, что если наш сервер не смог запуститься, то мы вернем сообщение об этом - app.use(express.json());
app.listen(4444, (err) => {
  if (err) {
    return console.log(error);
  }

  console.log("Server ok");
});
