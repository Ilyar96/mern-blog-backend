import { body } from "express-validator";

//! При помощи body проверяем, есть ли в теле нашего запроса какая-то информация и будем ее валидировать
export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatar", "Неверная ссылка на аватарку").optional().isURL(), //Если придет информация, то проверяем ссылка ли она
];
