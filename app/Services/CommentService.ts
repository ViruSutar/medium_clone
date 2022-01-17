import Database from "@ioc:Adonis/Lucid/Database";
import Comment from "App/Models/Comment";
import Reply from "App/Models/Reply";

export default class CommentService {
  static async addComment(user_uuid, article_id, comment) {
    let data = await Comment.create({
      user_id: user_uuid,
      article_id,
      comment,
    });

    return { success: true, CommentId: data.id };
  }

  //   TODO: authentication required
  static async editComment(comment_id, comment) {
    let data = await Comment.find(comment_id);

    if (!data) {
      return { success: false, message: "comment not found" };
    }

    if (comment) data.comment = comment;
    data.save();

    return { success: true, message: "comment edited successfully" };
  }

  //   TODO: authentication required
  static async deleteComment(comment_id) {
    let data = await Comment.find(comment_id);

    if (!data) {
      return { success: false, message: "comment not found" };
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
        Database.rawQuery("DATE_FORMAT(comments.created_at,'%d/%m/%Y') as Date")
      )
      .from("comments")
      .leftJoin("articles", "articles.id", "=", "comments.article_id")
      .leftJoin("users", "users.id", "=", "comments.user_id")
      .where("comments.article_id", article_id)
      .orderByRaw(Database.rawQuery(orderById + orderByDateQuery))
      .limit(limitQuery)
      .offset(parseInt(offset));

    return { success: true, Data: data };
  }

  public async replyToComment(comment_id, reply, user_uuid) {
    await Reply.create({
      comment_id,
      user_id: user_uuid,
      reply,
    });

    return { success: true};
  }
}
