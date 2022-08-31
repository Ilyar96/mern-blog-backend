import mongoose from "mongoose";

//Модель пользователя
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true, //Автоматически прикрутит дату создания
  }
);

export default mongoose.model("User", UserSchema);
