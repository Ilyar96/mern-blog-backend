import CommentModel from "../models/Comment.js";

export const getComments = async (req, res) => {
  const limit = req?.query?.limit ? req?.query?.limit : 0;

  try {
    const comments = await CommentModel.find()
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate("user")
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
};

export const getAllCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const limit = req?.query?.limit ? req.query.limit : 0;
    const page = req?.query?.page ? req.query.page : null;
    const sortBy = req?.query?.sortBy ? req.query.sortBy : "createdAt";
    const order =
      req?.query?.order && req?.query?.order.toLowerCase() === "asc" ? 1 : -1;

    const allComments = await CommentModel.find({ postId })
      .sort({ [sortBy]: order })
      .populate("user");

    CommentModel.find({ postId })
      .sort({ [sortBy]: order })
      .populate("user")
      .limit(limit)
      .skip(page ? limit * page - limit : 0)
      .exec((err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть комментарии",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Комментарии не найдена",
          });
        }

        const pagesCount =
          allComments?.length && Math.ceil(allComments?.length / limit);
        const commentsCount = allComments?.length && allComments.length;
        const isLastPage = pagesCount === Number(page);

        res.json({
          data: doc,
          pagesCount,
          commentsCount,
          isLastPage,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.body.user,
      postId: req.body.postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
};

export const removeByCommentId = (req, res) => {
  try {
    const commentId = req.params.commentId;

    CommentModel.findOneAndDelete(
      {
        _id: commentId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Не удалось удалить комментарий",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Комментарий не найдена",
          });
        }

        res.json({
          success: true,
          commentId,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить комментарий",
    });
  }
};

export const removeByPostId = (req, res) => {
  try {
    const postId = req.params.postId;

    CommentModel.deleteMany(
      {
        postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Не удалось удалить комментарии",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Комментарии не найдены",
          });
        }

        res.json({
          success: true,
          postId,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить комментарии",
    });
  }
};
