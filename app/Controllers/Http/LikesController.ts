// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import Like from "App/Models/Like";

export default class LikesController {

    public async addLikeToArticle({request,response}:HttpContextContract){
        try {
            let {article_id,user_id}=request.all()

            await request.validate({
                schema:schema.create({
                    article_id:schema.number(),
                    user_id:schema.number()
                })
            })
            await Like.create({
                article_id,
                user_id,
            })

            await Database.rawQuery('update  articles set articles.likes_count=articles.likes_count + 1 where articles.id= ?',article_id)

            return response.send({ success:true })
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }


    public async removeLike({request,response}:HttpContextContract){
        try {
            let {article_id,user_id}=request.all()

            await Like.query().where('article_id',article_id).where('user_id',user_id).delete()
   
            await Database.rawQuery('update  articles set articles.likes_count=articles.likes_count - 1 where articles.id= ?',article_id)
            return response.send({ success:true })
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }
}
