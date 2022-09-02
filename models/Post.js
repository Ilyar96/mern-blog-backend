import mongoose from "mongoose";

//Модель пользователя
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //! Делаем связь между 2мя таблицами - ссылаясь по id (предыдущая строка) на схему User (relationship)
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true, //Автоматически прикрутит дату создания
  }
);

export default mongoose.model("Post", PostSchema);
