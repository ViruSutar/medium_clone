import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import Comment from "App/Models/Comment";
import Reply from "App/Models/Reply";
import User from "App/Models/User";
import NotificationService from "./NotificationService";

export default class CommentService {
  static async writeComment(user_uuid, article_id, comment) {
    let data = await Comment.create({
      user_id: user_uuid,
      article_id,
      comment,
    });
    
    let article=await Article.find(article_id)
    let author_uuid=article?.author_id
    let user_name = await User.findBy("uuid", user_uuid);

    let notification = `${user_name?.name} has commented on your post`;

    NotificationService.createNotification(author_uuid, "comments", notification);

    return { success: true, CommentId: data.id };
  }

  static async editComment(comment_id, comment, user_uuid) {
    let data = await Comment.find(comment_id);

    if (!data) {
      return { success: false, message: "comment not found" };
    }

    if (data.user_id !== user_uuid) {
      return { success: false, message: "You do not have this permission" };
    }

    if (comment) data.comment = comment;
    data.save();

    return { success: true, message: "comment edited successfully" };
  }

  static async deleteComment(comment_id, user_uuid) {
    let data = await Comment.find(comment_id);

    if (!data) {
      return { success: false, message: "comment not found" };
    }

    if (data.user_id !== user_uuid) {
      return { success: false, message: "You do not have this permission" };
    }

    data.is_active = false;
    data.save();

    return { success: true, message: "comment deleted successfully" };
  }

  //   TODO: show replies  on that comments too and reply on reply too
  static async listCommentByArticleId(article_id, sort_by_date, limit, offset) {
    let orderByDateQuery = "";
    let orderById = " comments.id desc ";
    let limitQuery: number;

    if (limit) {
      limitQuery = parseInt(limit);
    } else {
      limitQuery = 10000000000;
    }

    if (!offset) {
      offset = 0;
    }

    if (sort_by_date) {
      orderById = "";
      orderByDateQuery = " comments.created_at  " + sort_by_date;
    }

    let data = await Database.query()
      .select(
        "comments.id as comment_id",
        "comments.comment",
        "users.name",
        Database.rawQuery(
          "json_arrayagg(json_object('reply',replies.reply,'replier_name',replier_name.name)) as replies, DATE_FORMAT(comments.created_at,'%d/%m/%Y') as Date"
        )
      )
      .from("comments")
      .join("articles", "articles.id", "=", "comments.article_id")
      .join("users", "users.uuid", "=", "comments.user_id")
      .leftJoin("replies", "replies.comment_id", "=", "comments.id")
      .joinRaw(
        Database.rawQuery(
          "left join users as replier_name on replier_name.uuid = replies.user_uuid"
        )
      )
      .where("comments.article_id", article_id)
      .where("comments.is_active", true)
      .orderByRaw(Database.rawQuery(orderById + orderByDateQuery))
      .groupBy("comments.id")
      .limit(limitQuery)
      .offset(parseInt(offset))
      .then((data) => {
        return data.map((row) => {
          row.replies = JSON.parse(row.replies);
          return row;
        });
      });

    return { success: true, Data: data };
  }

  // TODO: if i delete comment on which replies are so all the replies on will also get deleted
  // TODO: yes all the replies cn that comment should also get deleted
  static async replyToComment(comment_id, reply, user_uuid) {
    await Reply.create({
      comment_id,
      user_uuid,
      reply,
    });

    return { success: true };
  }
}
