import PostModel from "../models/Post.js";
import CommentModel from "../models/Comment.js";
import async from "async";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).exec();
    const tags = posts
      .map((obj) => {
        return obj.tags;
      })
      .flat();

    const lastTags = Array.from(new Set(tags)).slice(0, 5);
    res.json(lastTags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить теги",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    let allPosts;
    let tag = req?.query?.tag ? { tags: req.query.tag } : {};
    const limit = req?.query?.limit ? req.query.limit : 0;
    const page = req?.query?.page ? req.query.page : null;
    const sortBy = req?.query?.sortBy ? req.query.sortBy : "createdAt";
    const order =
      req?.query?.order && req?.query?.order.toLowerCase() === "asc" ? 1 : -1;

    if (page && limit) {
      allPosts = await PostModel.find(tag)
        .sort({ [sortBy]: order })
        .populate("user")
        .exec();
    }

    const posts = await PostModel.find(tag)
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(page ? limit * page - limit : 0)
      .populate("user")
      .exec();

    res.json({
      data: posts,
      pagesCount: allPosts?.length && Math.ceil(allPosts?.length / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, //Инкрементируем просмотры поста
      },
      {
        returnDocument: "after", // После обновления возвращаем обновленный документ
      }
    )
      .populate("user")
      .exec((err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть статью",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json(doc);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const remove = (req, res) => {
  try {
    const queries = [];
    const postId = req.params.id;

    queries.push((cb) => {
      PostModel.findOneAndDelete(
        {
          _id: postId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "Не удалось удалить статью",
            });
          }

          if (!doc) {
            return res.status(404).json({
              message: "Статья не найдена",
            });
          }
        }
      );
    });

    queries.push((cb) => {
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
    });

    async.parallel(queries, function (err, docs) {
      if (err) {
        throw err;
      }

      res.json({
        success: true,
        postId,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.body.userId,
        tags: req.body.tags,
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
