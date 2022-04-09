import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import Bookmark from "App/Models/Bookmark";

export default class BookMarkService {
  static async addBookMark(user_uuid, article_id,bookmark_folder) {
    let article = await Article.query()
      .select("articles.id")
      .where("articles.is_active", 1)
      .where("articles.is_draft", 0)
      .where("articles.id", article_id);

    if (article.length === 0) {
      return { success: false, status_code: 404, message: "article not found" };
    }

    let bookmark = await Bookmark.query()
      .where("user_id", user_uuid)
      .where("article_id", article_id);

    if (bookmark.length !== 0) {
      return { success: false, status_code:400,message:"This article is  already bookmarked"};
    }
    await Bookmark.create({
      user_id: user_uuid,
      article_id,
      bookmark_folder
    });

    return { success: true };
  }

  static async removeBookMark(bookmark_id, user_uuid) {
    let bookmark = await Bookmark.find(bookmark_id);

    if (!bookmark) {
      return {
        success: false,
        status_code: 404,
        message: "bookmark not found",
      };
    }

    if (bookmark.user_id !== user_uuid) {
      return {
        success: false,
        status_code: 403,
        message: "You do not have this permission",
      };
    }

    bookmark.delete();
    bookmark.save();
    return { success: true };
  }

  static async listBookMarks(user_uuid) {
    // TODO: we should not show deleted articles inside the bookmark even if they are bookmarked before article is been deleted
    // TODO: and show message like this post is been removed for some reasons
      // TODO: article count inside folder
    let [bookmarks, total] = await Promise.all([
      Database.rawQuery(
        'select users.name as author_name,JSON_ARRAYAGG(JSON_OBJECT("title",articles.title,"article_id",articles.id,\
        "content",SUBSTRING(articles.content,1,200),"likes_count",articles.likes_count,"comments_count",articles.comments_count ,\
        "Date",DATE_FORMAT(articles.created_at,"%d/%m/%Y"),"image",articles_images.image_link,"tag_name",tags.name,\
        "reading_time",articles.reading_time,"bookmark_id",bookmarks.id,"bookmark_folder",bookmarks.bookmark_folder)) as article_details\
         from bookmarks \
         join articles on bookmarks.article_id = articles.id\
         join users on users.uuid=articles.author_id \
         left join articles_images on articles_images.article_id = articles.id and is_cover = 1\
         left join  article_tags on  article_tags.article_id = articles.id\
         left join tags on tags.id =  article_tags.tag_id  where bookmarks.user_id = :user_uuid AND  articles.is_active = 1 AND articles.is_draft = 0 \
         group by bookmarks.bookmark_folder  ',
        { user_uuid }
      ).then((data)=>{
        return data[0].map((list)=>{
         let newArticles: object[] = [];
         let uniqueArticleIds: number[] = [];
         let oldArticles = JSON.parse(list.article_details);
         oldArticles.forEach((article) => {
           const articleId: number = article.article_id;
           oldArticles.indexOf(article) == 0 &&
             uniqueArticleIds.push(articleId) &&
             newArticles.push(article);
           if (!uniqueArticleIds.includes(articleId)) {
             uniqueArticleIds.push(articleId);
             newArticles.push(article);
           }
         });
         list.article_details = newArticles;
         list.count= newArticles.length     
         return list
        })
        
      }),
      Database.rawQuery(
        'select count(distinct bookmarks.id )as count\
         from bookmarks \
         join articles on bookmarks.article_id = articles.id\
         join users on users.uuid=articles.author_id \
         left join articles_images on articles_images.article_id = articles.id and is_cover = 1\
         left join  article_tags on  article_tags.article_id = articles.id\
         left join tags on tags.id =  article_tags.tag_id  where bookmarks.user_id = :user_uuid AND \
         articles.is_active = 1 AND articles.is_draft = 0',
        { user_uuid }
      ),
    ]);
    
    return {
      success: true,
      bookmarks: bookmarks[0].length === 0 ? "No bookmarks found " : bookmarks,
      total: total[0] ? total[0][0].count : 0,
    };
  }
}
