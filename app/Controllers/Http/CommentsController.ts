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
          comment: schema.string(),
        }),
      });

     let data= await Comment.create({
        user_id,
        article_id,
        comment,
      });

      return response.send({ success: true,CommentId:data.id });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async updateComment({request,response}){
    try {
      let {comment_id,comment}=request.all()

      await request.validate({
        schema:schema.create({
          comment_id:schema.number(),
          comment : schema.string.optional()
        })
      })

      let data = await Comment.find(comment_id)

      if(!data){
        throw("comment not found")
      }
       
      if(comment) data.comment=comment
      data.save()

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async deleteComment({request,response}){
    try {
      let {comment_id}=request.all()

      let data = await Comment.find(comment_id)

      if(!data){
        throw("comment not found")
      }

      data.is_active=false
      data.save()
      
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
