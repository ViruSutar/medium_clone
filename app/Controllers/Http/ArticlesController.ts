// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";

export default class ArticlesController {
    public async createArticle({request,response}:HttpContextContract){
        try {
            // TODO: multiple titles and images validation
            let {title,content,image,user_id,article_type,sub_category_id}=request.all()
           let article= await Article.create({
                title,
                image,
                content,
                user_id,
                article_type,
                sub_category_id  

            })
            return response.send({ success:true,articleId:article.id })
            
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

    public async listArticles({request,response}:HttpContextContract){
        try {
            // TODO: filters and group by categories linit offset,total
            let data=await Database.query()
            .select('articles.title','articles.id as article_id','articles.article_type','article_sub_categories.sub_type_name')
            .from('articles')
            .leftJoin('article_sub_categories',' article_sub_categories.id','=','articles.sub_category_id')
            .groupBy('articles.id')

            
            return response.send({ success:true,data})

        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }
}
