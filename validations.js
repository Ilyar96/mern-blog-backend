import { body } from "express-validator";

//! При помощи body проверяем, есть ли в теле нашего запроса какая-то информация и будем ее валидировать
export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatar", "Неверная ссылка на аватарку").optional().isString(), //Если придет информация, то проверяем ссылка ли она
];

export const postCreateValidation = [
  body("title", "Введите заголовок статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Введите текст статьи")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Неверный формат тегов (укажите массив)").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];

export const commentValidation = [
  body("text", "Введите комментарий")
    .isLength({
      min: 1,
    })
    .isString(),
  body("postId", "Введите id поста")
    .isLength({
      min: 5,
    })
    .isString(),
];
