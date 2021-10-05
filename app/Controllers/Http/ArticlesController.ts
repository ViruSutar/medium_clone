// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import { schema } from '@ioc:Adonis/Core/Validator'
import ArticleSubCategory from "App/Models/ArticleSubCategory";

export default class ArticlesController {
    public async createArticle({request,response}:HttpContextContract){
        try {
            // TODO: multiple titles and images validation
            let {title,content,image,user_id,article_categories,sub_category_id}=request.all()

            await request.validate({
                schema:schema.create({
                    title:schema.string(),
                    image:schema.array.optional().anyMembers(),
                    user_id:schema.number.optional(),
                    article_categories:schema.string(),
                    sub_category_id:schema.number()
                })
            })
           let article= await Article.create({
                title,
                image:JSON.stringify(image),
                content,
                user_id,
                article_categories,
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
            // TODO: filters and group by categories,sub_cate,by user_id,by_likes_count most liked will be on top
            // TODO: change column name to subtype 
           
            let {limit,offset,article_type,sub_categories_id,sort_by_likes,sort_by_date,author_name}=request.all()

            let params={}
            let limitQuery = ''
            let offsetQuery = ''
            let typeQuery=''
            let subTypeQuery=''
            let authorNameQuery=''
            let orderByLikes=''
            let orderById='Order By articles.id  desc '
            let orderByDate= ' '

             if (limit != null && limit != '') {
                limitQuery = ' limit :limit'
                params['limit'] = parseInt(limit)
              }
        
              if (limit != null && limit != '' && offset != null && offset != '') {
                offsetQuery = ' offset :offset'
                params['offset'] = parseInt(offset)
              }
        

              if(article_type != null && article_type !=''){
                 typeQuery=" AND articles.article_type = :article_type  "
                 params["article_type"]=article_type
                    
              }

              if(sub_categories_id != null && sub_categories_id != ''){
                subTypeQuery=" AND articles.sub_category_id = :sub_categories_id  "
                params["sub_categories_id"]=sub_categories_id
                   
             }

             if(sort_by_likes != null && sort_by_likes != ''){
                 //use limit 5 to get top 5 trending articles 
                //  TODO: this query  should run only once a day so the we can set todays top 5 articles
                 orderById=''
                 orderByLikes= ' order by articles.likes_count desc ' 
             }

             if(sort_by_date != null && sort_by_date != ''){
                 orderById=''
                 orderByDate = ' order by articles.created_at ' + sort_by_date
             }

             if(sort_by_likes && sort_by_date) {
                 return response.send({message:"Select only one filter"})
             }

             if(author_name != null && author_name != ''){
                 params['author_name']=author_name
                 authorNameQuery=' AND users.name = :author_name '
             }
             
                          
            let [data,total]=await Promise.all([
                Database.rawQuery(
                    'select users.name as author_name, articles.title,articles.id as article_id,articles.article_categories,article_sub_categories.sub_categories, \
                    articles.sub_category_id as sub_type_id,articles.likes_count, DATE_FORMAT(articles.created_at,"%d/%m/%Y") as Date\
                     from articles \
                     left join article_sub_categories on article_sub_categories.id=articles.sub_category_id \
                     left join users on users.id=articles.user_id \
                     where articles.is_active=1 '
                     +typeQuery
                     +subTypeQuery
                     +authorNameQuery+
                     ' group by articles.id  \
                     '+orderById
                     +orderByLikes
                     +orderByDate
                     +limitQuery 
                      +offsetQuery
                     ,params
                ),
                Database.rawQuery(
                    'select count(distinct articles.id) as count \
                     from articles \
                     left join article_sub_categories on article_sub_categories.id=articles.sub_category_id \
                     left join users on users.id=articles.user_id \
                     where articles.is_active=1'
                     +typeQuery
                     +subTypeQuery
                     +authorNameQuery
                     ,params
                )
            ])       
            return response.send({ success:true,Data:data[0],total: total[0] ? total[0][0].count : 0})

        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

    public async getArticleById({request,response}:HttpContextContract){
        try {
            let {article_id}=request.all()
          let data=await Database.query()
                         .select('articles.title','users.name as author','article_sub_categories.sub_type_name','articles.content'
                                  ,'articles.image as image','articles.likes_count')
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
              article_categories,
              sub_category_id,
            } = request.all();

            let article=await Article.findByOrFail('id',article_id)

            if(image) article.image=image
            if(title) article.title=title
            if(content) article.content=content
            if(user_id) article.user_id=user_id
            if(article_categories) article.article_categories=article_categories
            if(sub_category_id) article.sub_category_id=sub_category_id

            article.save()           
            return response.send({ success:true})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }



    //SubCategories


    public async listSubCategories({request,response}:HttpContextContract){
        try {
           let {limit,offset}=request.all()
           let limitQuery = ''
           let offsetQuery = ''
           let params={}

           if (limit != null && limit != '') {
            limitQuery = ' limit :limit'
            params['limit'] = parseInt(limit)
          }
    
          if (limit != null && limit != '' && offset != null && offset != '') {
            offsetQuery = ' offset :offset'
            params['offset'] = parseInt(offset)
          }
    
           
            
            let [data,total] =await Promise.all([
                Database.rawQuery(
                        'select article_sub_categories.sub_categories, article_sub_categories.id \
                         from  article_sub_categories \
                         where article_sub_categories.is_active = 1'
                        +limitQuery
                        +offsetQuery
                        ,params)          
                ,
               Database.rawQuery(
                        'select count (distinct article_sub_categories.id) \
                         from  article_sub_categories \
                         where article_sub_categories.is_active = 1')
            ])


            return response.send({ success:true,Data:data[0],total: total[0] ? total[0][0].count : 0})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

    public async createSubCategories({request,response}:HttpContextContract){
        try {
             let {sub_categories}=request.all()

             await request.validate({
                 schema:schema.create({
                    sub_categories:schema.string()
                 })
             })

             await ArticleSubCategory.create({
                 sub_categories
             })
            
            return response.send({ success:true})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

    public async updateSubcategories({request,response}:HttpContextContract){
        try {
            let {sub_category_id,sub_category}=request.all()

            await request.validate({
                schema:schema.create({
                   sub_category:schema.string.optional(),
                   sub_category_id:schema.number()
                })
            })

           let subcategory= await ArticleSubCategory.findByOrFail('id',sub_category_id)

           if(subcategory) subcategory.sub_categories=sub_category

           subcategory.save()
            
            return response.send({ success:true})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

    public async deleteSubcategories({request,response}:HttpContextContract){
        try {
            let {sub_category_id}=request.all()

           await ArticleSubCategory.query().where('id',sub_category_id).update('is_active',0)
             
            return response.send({ success:true})
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

    public async listTopAuthors({request,response}:HttpContextContract){
        try {
             
           let data= await Database.query()
                                   .select(Database.rawQuery(
                                       'users.name ,users.id ,sum(articles.likes_count) as  likes_count '
                                   ))
                                   .from('articles')
                                   .join('users','users.id','=','articles.user_id')
                                   .groupBy('users.id')
                                   .orderBy('likes_count','desc')
                                   .limit(5)
            
            return response.send({ success:true,Data:data })
        } catch (error) {
            console.log(error)
            return response.send({ success: false, message: error })
        }
    }

}
