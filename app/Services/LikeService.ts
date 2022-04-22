import Like from "App/Models/Like";
import Database from "@ioc:Adonis/Lucid/Database";
import NotificationService from "./NotificationService";
import { NotificationType } from "App/Enum/NotificationTypeEnum";
import User from "App/Models/User";
import Article from "App/Models/Article";

export default class LikeService {
  static async addLike(article_id, user_uuid) {
    let checkLike = await Like.query().whereRaw(
      Database.rawQuery("article_id = :article_id AND user_id = :user_uuid ", {
        article_id,
        user_uuid,
      })
    );

    let findArticle = await Article.find(article_id);

    if (!findArticle) {
      return { success: false, status_code: 404, message: "article not found" };
    }

    if (checkLike.length !== 0) {
      return {
        success: false,
        status_code:400,
        message: "You have already liked on this article",
      };
    }

    await Like.create({
      article_id,
      user_id: user_uuid,
    });

    await Database.rawQuery(
      "update  articles set articles.likes_count=articles.likes_count + 1 \
         where articles.id= ?",
      article_id
    );
    // TODO: send notication to author of article
    let article=await Article.find(article_id)
    let author_uuid=article?.author_id
    let user_name = await User.findBy("uuid", user_uuid);

    // TODO: before writing apis think what you want to write or write down if api is big and then execute then you won't missout things
    let notification = `${user_name?.name} has liked your post`;
    NotificationService.createNotification(author_uuid, "likes", notification);

    return { success: true };
  }

  static async removeLike(article_id, user_uuid) {
    await Like.query()
      .where("article_id", article_id)
      .where("user_id", user_uuid)
      .delete();

    let findArticle = await Article.find(article_id);

    if (!findArticle) {
      return { success: false, status_code: 404, message: "article not found" };
    }

    await Database.rawQuery(
      "update  articles set articles.likes_count=articles.likes_count - 1 where articles.id= ?",
      article_id
    );

    return { success: true };
  }
}
