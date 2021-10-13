// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/http-server/build/standalone";
import Database from "@ioc:Adonis/Lucid/Database";
import { schema } from "@ioc:Adonis/Core/Validator";
import Bookmark from "App/Models/Bookmark";

export default class UsersController {
  public async getUserNotificationById({ request, response }: HttpContext) {
    try {
      let { user_id } = request.all();

      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
        }),
        messages: {
          "req.user_id": "user_id is required",
        },
      });
      let data = await Database.query()
        .select(
          Database.rawQuery(
            'user_notifications.id,user_notifications.message,date_format(user_notifications.created_at,"%D %M %Y") as Date'
          )
        )
        .from("user_notifications")
        .where("user_notifications.user_id", user_id)
        .orderBy("user_notifications.created_at", "desc");

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async addBookMark({request,response}:HttpContext){
    try {
      let {user_id,article_id,bookmark_type}=request.all()
      
      await request.validate({
        schema:schema.create({
          user_id : schema.number(),
          article_id: schema.number(),
          bookmark_type : schema.string.optional()
        })
      })
      await Bookmark.create({
        user_id,
        bookmark_id:article_id,
        bookmark_type
      })
      

      return response.send({ success: true})
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async listBookMarksByUserId({request,response}:HttpContext){
    try {
      let {user_id,bookmark_type}=request.all()

      let bookMarkTypeQuery=''
      let params= {user_id}

      await request.validate({
        schema:schema.create({
          user_id:schema.number(),
          bookmark_type:schema.string.optional()
        })
      })
    
      if(bookmark_type){
       bookMarkTypeQuery = ' AND bookmarks.bookmark_type = :bookmark_type '
       params['bookmark_type'] = bookmark_type
       
      }

      let data=await Database.query()
                              .select(Database.rawQuery('bookmarks.id as bookmark_id,users.name,articles.title,articles.content,bookmarks.bookmark_type'))
                              .from('bookmarks')
                              .leftJoin('users','users.id','=','bookmarks.user_id')
                              .leftJoin('articles','articles.id','=','bookmarks.bookmark_id')
                              .whereRaw(Database.rawQuery('bookmarks.user_id = :user_id ' +bookMarkTypeQuery,params))

      
      return response.send({ success: true,Data:data})
    } catch (error) {
      console.log(error)
      return response.send({ success: false, message: error })
    }
  }

  public async deleteBookMark({request,response}:HttpContext){
    try {
      let {user_id,bookmark_id}=request.all()

      await request.validate({
        schema:schema.create({
          user_id:schema.number(),
          bookmark_id:schema.number()
        })
      })

      await Bookmark.query().where('user_id',user_id).where('id',bookmark_id).delete()
      
      return response.send({ success: true})
    } catch (error) {
      console.log(error)
      return response.send({ success: false, message: error })
    }
  }
}
