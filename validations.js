import { body } from "express-validator";

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
  body("avatar", "Неверная ссылка на аватарку").optional().isString(),
];

export const postCreateValidation = [
  body("title", "Заголовок статьи должен содержать не менее 3 символов")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Текст статьи должен содержать не менее 10 символов")
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
