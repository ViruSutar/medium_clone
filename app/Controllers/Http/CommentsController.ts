import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Comment from "App/Models/Comment";
import { schema } from "@ioc:Adonis/Core/Validator";
import Reply from "App/Models/Reply";
import CommentValidator from "App/Validators/CommentValidator";
import CommentService from "App/Services/CommentService";

export default class CommentsController {
  public async createComment({ request, response }: HttpContextContract) {
    let { user_uuid, article_id, comment } = request.all();

    await request.validate(CommentValidator.addComment);

    let data = await CommentService.addComment(
      user_uuid,
      article_id,
      comment
    );

    return response.send({ success: true});
  }

  public async editComment({ request, response }) {
      let { comment_id, comment } = request.all();

      await request.validate(CommentValidator.editComment);

      let data=await CommentService.editComment(comment_id,comment)

      if(data.success === false){
        return response
        .status(404)
        .send({ success: false, message: data.message });
      }
       
      return response.send({ success: true });
  }

  public async deleteComment({ request, response }) {
      let { comment_id } = request.all();

      await request.validate(CommentValidator.editComment)

      let data=await CommentService.deleteComment(comment_id)

     if(data.success === false){
        return response
        .status(404)
        .send({ success: false, message: data.message });
      }
      return response.send({ success: true });
  }

  public async listCommentsByArticleId({
    request,
    response
  }: HttpContextContract) {
    try {
      let { article_id, sort_by_date, limit, offset } = request.all();

      await request.validate({
        schema: schema.create({
          article_id: schema.number(),
          sort_by_date: schema.string.optional(),
        }),
      });
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
            "DATE_FORMAT(comments.created_at,'%d/%m/%Y') as Date"
          )
        )
        .from("comments")
        .leftJoin("articles", "articles.id", "=", "comments.article_id")
        .leftJoin("users", "users.id", "=", "comments.user_id")
        .where("comments.article_id", article_id)
        .orderByRaw(Database.rawQuery(orderById + orderByDateQuery))
        .limit(limitQuery)
        .offset(parseInt(offset));

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async replyToComment({ request, response }: HttpContextContract) {
      let { comment_id, reply, user_uuid } = request.all();

      await request.validate(CommentValidator.replyToComment);

     let data=await CommentService.
     
      return response.send({ success: true });
    
  }

  public async getCommentByIdWithReply({
    request,
    response,
  }: HttpContextContract) {
    try {
      // TODO: Doubt on this api
      let { comment_id } = request.all();

      await request.validate({
        schema: schema.create({
          comment_id: schema.number(),
        }),
      });

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
