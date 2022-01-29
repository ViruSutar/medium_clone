import Database from "@ioc:Adonis/Lucid/Database";
import Bookmark from "App/Models/Bookmark";

export default class BookMarkService {
  static async addBookMark(user_uuid, article_id) {
    Bookmark.create({
      user_id: user_uuid,
      article_id,
    });

    return { success: true };
  }

  static async removeBookMark(bookmark_id) {
    let boomark = await Bookmark.find(bookmark_id);

    if (!boomark) {
      return { success: false, message: "bookmark not found" };
    }

     boomark.delete();
    boomark.save();
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
