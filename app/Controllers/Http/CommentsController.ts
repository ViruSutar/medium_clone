import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Comment from "App/Models/Comment";
import { schema } from "@ioc:Adonis/Core/Validator";
import Reply from "App/Models/Reply";
import CommentValidator from "App/Validators/CommentValidator";
import CommentService from "App/Services/CommentService";

export default class CommentsController {
  public async writeComment({ request, response }) {
    let { article_id, comment } = request.all();
    let user_uuid= request.user.user_uuid

    await request.validate(CommentValidator.writeComment);

    let data = await CommentService.writeComment(
      user_uuid,
      article_id,
      comment
    );

    return response.send({ success: true,commentId:data.CommentId });
  }

  public async editComment({ request, response }) {
    let { comment_id, comment } = request.all();
    let user_uuid= request.user.user_uuid
 
    await request.validate(CommentValidator.editComment);

    let data = await CommentService.editComment(comment_id, comment,user_uuid);

    if (data.success === false) {
      return response
        .status(404)
        .send({ success: false, message: data.message });
    }

    return response.send({ success: true });
  }

  public async deleteComment({ request, response }) {
    let { comment_id } = request.all();
    let user_uuid= request.user.user_uuid
    
    await request.validate(CommentValidator.editComment);

    let data = await CommentService.deleteComment(comment_id,user_uuid);

    if (data.success === false) {
      return response
        .status(404)
        .send({ success: false, message: data.message });
    }
    return response.send({ success: true });
  }

  public async listCommentsByArticleId({
    request,
    response,
  }: HttpContextContract) {
    let { article_id, sort_by_date, limit, offset } = request.all();

    await request.validate(CommentValidator.listCommentsByArticleId);

    let data = await CommentService.listCommentByArticleId(
      article_id,
      sort_by_date,
      limit,
      offset
    );

    return response.send({ success: true, Data: data });
  }

  public async replyToComment({ request, response }: HttpContextContract) {
    let { comment_id, reply, user_uuid } = request.all();

    await request.validate(CommentValidator.replyToComment);

     await CommentService.replyToComment(
      comment_id,
      reply,
      user_uuid
    );

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
