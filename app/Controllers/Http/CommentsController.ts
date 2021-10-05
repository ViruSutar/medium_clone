import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Comment from "App/Models/Comment";
import { schema } from "@ioc:Adonis/Core/Validator";
import Reply from "App/Models/Reply";
  
export default class CommentsController {
  public async createComment({ request, response }: HttpContextContract) {
    try {
      let { user_id, article_id, comment } = request.all();

      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          article_id: schema.number(),
          comment: schema.string.optional(),
        }),
      });

      await Comment.create({
        user_id,
        article_id,
        comment,
      });

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async listCommentsByArticleId({
    request,
    response,
  }: HttpContextContract) {
    try {
      // TODO:filters

      let { article_id } = request.all();

      await request.validate({
        schema: schema.create({
          article_id: schema.number(),
        }),
      });

      let data = await Database.query()
        .select("comments.comment", "users.name")
        .from("comments")
        .leftJoin("articles", "articles.id", "=", "comments.article_id")
        .leftJoin("users", "users.id", "=", "comments.user_id")
        .where("comments.article_id", article_id);

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async replyToComment({ request, response }: HttpContextContract) {
    try {
      let { comment_id, reply, user_id } = request.all();

      await request.validate({
        schema: schema.create({
          comment_id: schema.number(),
          user_id: schema.number(),
          reply: schema.string(),
        }),
      });

      await Reply.create({
        comment_id,
        user_id,
        reply,
      });

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async getCommentByIdWithReply({ request, response }: HttpContextContract) {
    try {
      // TODO: Doubt on this api
      let { comment_id } = request.all();
     
      await request.validate({
        schema:schema.create({
          comment_id:schema.number()
        })
      })

      let data = await Database.query()
        .select(
          Database.rawQuery(
            "comments.comment,json_arrayagg(replies.reply) as reply,json_arrayagg(users.name) as user"
          )
        )
        .from("replies")
        .leftJoin("comments", "comments.id", "=", "replies.comment_id")
        .leftJoin("users", "users.id", "=", "replies.user_id")
        .where("replies.comment_id", comment_id)
        .groupBy("replies.comment_id")
        .then((data) => {
          return data.map((row) => {
            let comment = row;
            comment.reply = JSON.parse(comment.reply);
            comment.user = JSON.parse(comment.user);
            return comment;
          });
        });

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }
}
