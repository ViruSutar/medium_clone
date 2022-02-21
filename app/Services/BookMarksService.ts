import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import Bookmark from "App/Models/Bookmark";

export default class BookMarkService {
  static async addBookMark(user_uuid, article_id) {
    let article = await Article.find(article_id);

    if (!article) {
      return { success: false, status_code: 404, message: "article not found" };
    }

    let bookmark = await Bookmark.query()
      .where("user_id", user_uuid)
      .where("article_id", article_id);

    if (bookmark.length !== 0) {
      return { success: true };
    }
    await Bookmark.create({
      user_id: user_uuid,
      article_id,
    });

    return { success: true };
  }

  static async removeBookMark(bookmark_id, user_uuid) {
    let bookmark = await Bookmark.find(bookmark_id);

    if (!bookmark) {
      return { success: false, status_code:404,message: "bookmark not found" };
    }

    if (bookmark.user_id !== user_uuid) {
      return { success: false,status_code:403, message: "You do not have this permission" };
    }
    

    bookmark.delete();
    bookmark.save();
    return { success: true };
  }

  static async listBookMarks(user_uuid) {
    let bookmarks = await Database.rawQuery(
      'select users.name as author_name, articles.title,articles.id as article_id,SUBSTRING(articles.content,1,200) as content,  \
      articles.likes_count,articles.comments_count, DATE_FORMAT(articles.created_at,"%d/%m/%Y") as Date,\
      articles_images.image_link as image,tags.name as tag_name,articles.reading_time,bookmarks.id as bookmark_id\
       from bookmarks \
       join articles on bookmarks.article_id = articles.id\
       join users on users.uuid=articles.author_id \
       left join articles_images on articles_images.article_id = articles.id and is_cover = 1\
       left join  article_tags on  article_tags.article_id = articles.id\
       left join tags on tags.id =  article_tags.tag_id  where bookmarks.user_id = :user_uuid AND  articles.is_active = 1 AND articles.is_draft = 0 \
       group by articles.id  ',
      { user_uuid }
    );

    return {
      success: true,
      bookmarks:
        bookmarks[0].length === 0 ? "No bookmarks found " : bookmarks[0],
    };
  }
}
