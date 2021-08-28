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

    public async getArticleById({request,response}:HttpContextContract){
        try {
            let {article_id}=request.all()
          let data=await Database.query()
                         .select('articles.title','users.name as author','article_sub_categories.sub_type_name','articles.content')
                         .from('articles')
                         .leftJoin('users','users.id','=','articles.user_id')
                         .leftJoin('article_sub_categories' ,'article_sub_categories.id','=','articles.sub_category_id')  
                         .where('articles.is_active',1 ,)
                         .where('articles.id',article_id)
                         .groupBy('articles.id')
            

            return response.send({ success:true,Data:data[0] ? data[0]:'article not found'})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }


    public async updateArticle({request,response}:HttpContextContract){
        try {
            // TODO: not tested
            let {
              article_id,
              title,
              image,
              content,
              user_id,
              article_type,
              sub_category_id,
            } = request.all();

            let article=await Article.findByOrFail('id',article_id)

            if(image) article.image=image
            if(title) article.title=title
            if(content) article.content=content
            if(user_id) article.user_id=user_id
            if(article_type) article.article_type=article_type
            if(sub_category_id) article.sub_category_id=sub_category_id

            article.save()           
            return response.send({ success:true})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }
}
