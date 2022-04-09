import Database from "@ioc:Adonis/Lucid/Database";
import { NotificationType } from "App/Enum/NotificationTypeEnum";
import { TagEnums } from "App/Enum/TagEnums";
import Tag from "App/Models/Tag";
import NotificationService from "./NotificationService";

export default class TagService {
  

  static async RequestForTag(
    tag_name: string,
    description: string,
    image_link: string,
    user_uuid: string
  ) {
    let find_tag = await Tag.findBy("name", tag_name);
    if (find_tag) {
      return {
        success: false,
        status_code: 403,
        message: `tag with name ${tag_name} already exist`,
      };
    }

    console.log(find_tag);

    if (!image_link) {
      image_link =
        "https://hashnode.com/_next/image?url=https%3A%2F%2Fcdn.hashnode.com%2Fres%2Fhashnode%2Fimage%2Fupload%2Fv1644902300094%2FqI9DIT5tW.png%3Fauto%3Dcompress&w=2048&q=75";
    }

    let tag = await Tag.create({
      name: tag_name,
      description,
      image_link,
      user_uuid,
      status: TagEnums.Pending,
    });

    return { success: true, message: "successfully  submitted " };
  }

  static async searchTags(tag_name: string) {
    let params = {
      status: TagEnums.Approved,
      tag_name: tag_name + "%",
    };

    let tags = await Database.query()
      .select(Database.rawQuery("tags.name,tags.used_in_articles_count"))
      .from("tags")
      .whereRaw(
        Database.rawQuery(
          "tags.status = :status AND tags.name LIKE :tag_name",
          params
        )
      );

    return { success: true, tags: tags.length !== 0 ? tags : "tag not found" };
  }

  static async listTags(
    today_trending: string,
    weekly_trending: string,
    limit: string,
    offset: string
  ) {
    let todayTrendingQuery = "";
    let weeklyTrendingQuery = "";
    let orderById = "tags.id desc";
    if (today_trending && weekly_trending) {
      return {
        success: false,
        status_code: 400,
        message: "Cannot use two filters together",
      };
    }
    if (!limit) {
      limit = "1000000000000000";
    }

    if (!offset) {
      offset = "0";
    }

    if (today_trending === 'true') {
      orderById = "";
      todayTrendingQuery = "tags.today_used_in_articles desc";
    }

    if (weekly_trending === 'true') {
      orderById = "";
      weeklyTrendingQuery = "tags.weekly_used_in_articles desc";
    }

    let [tags,total] = await Promise.all([
      await Database.query()
      .select(
        Database.rawQuery(
          "tags.id,tags.name,tags.image_link,tags.today_used_in_articles,tags.weekly_used_in_articles, \
                                                tags.weekly_used_in_articles"
        )
      )
      .from("tags")
      .whereRaw(Database.rawQuery("tags.is_active = 1 AND tags.status = 10 "))
      .orderByRaw(
        Database.rawQuery(orderById + todayTrendingQuery + weeklyTrendingQuery)
      )
      .limit(parseInt(limit))
      .offset(parseInt(offset)),

      await Database.query()
      .select(
       Database.rawQuery("count(distinct tags.id) as count")
      )
      .from("tags")
      .whereRaw(Database.rawQuery("tags.is_active = 1 AND tags.status = 10 "))
      .orderByRaw(
        Database.rawQuery(orderById + todayTrendingQuery + weeklyTrendingQuery)
      )
    ])
    
    return { success: true, 
      tags: tags ? tags : "no tags found",
      total: total[0] ? total[0].count : 0
     };
  }

  
}
