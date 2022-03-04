import Database from "@ioc:Adonis/Lucid/Database";
import { NotificationType } from "App/Enum/NotificationTypeEnum";
import { TagEnums } from "App/Enum/TagEnums";
import Tag from "App/Models/Tag";
import NotificationService from "./NotificationService";

export default class TagService {
  static async createTag(
    tag_name: string,
    user_uuid: string,
    image_link: string,
    description: string
  ) {
    if (!image_link) {
      image_link =
        "https://hashnode.com/_next/image?url=https%3A%2F%2Fcdn.hashnode.com%2Fres%2Fhashnode%2Fimage%2Fupload%2Fv1644902300094%2FqI9DIT5tW.png%3Fauto%3Dcompress&w=2048&q=75";
    }
    let tag = await Tag.create({
      name: tag_name,
      status: TagEnums.Approved,
      user_uuid,
      description,
      image_link,
    });

    return { success: true, tagId: tag.id };
  }

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

  static async listTags() {
    // TODO: tag image needed
    // TODO: trending tags feature used in article today,this week  overall 
    let tags = await Tag.query().select("name", "used_in_articles_count");

    return { success: true, tags: tags ? tags : "no tags found" };
  }

  static async deleteTag(tag_id: number, user_uuid: string) {
    let tag = await Tag.find(tag_id);
    if (!tag) {
      return { success: false, status_code: 404, message: "Tag not found" };
    }

    tag.is_active=false;
    tag.save();

    return { success: true };
  }

  static async updateTag(
    tag_id: number,
    name: string,
    status: [string],
    image_link: string
  ) {
    let tag = await Tag.find(tag_id);
    if (!tag) {
      return { success: false, status_code: 404, message: "Tag not found" };
    }

    let enum_status: any = TagEnums[status[0]];
    if (name) tag.name = name;
    if (status) tag.status = enum_status;
    if (image_link) tag.image_link = image_link;
    await tag.save();

    if (status[0] === "Approved") {
      let tag_creater_uuid = tag.user_uuid;
      
      NotificationService.createNotification(
        tag_creater_uuid,
        "tags",
        `congratulations your tag request for tag ${tag.name} is been approved`
      );
    }

    return { success: true, message: "Tag updated successfully" };
  }

  static async rejectTag(tag_id: number, rejection_note: string) {
    let tag = await Tag.find(tag_id);
    if (!tag) {
      return { success: false, status_code: 404, message: "Tag not found" };
    }
    if(tag.status === TagEnums.Rejected ){
      return {success:false,status_code:400,message:'This tag is already rejected'}
    }
    tag.status = TagEnums.Rejected;
    tag.rejection_note =rejection_note;
    let message=`Sorry we have requested your tag request for reason  "${rejection_note}"`
    tag.save();
    let tag_creater_uuid = tag.user_uuid;
    NotificationService.createNotification(
      tag_creater_uuid,
      "tags",
      message
    );
  }

  static async listTagsAdmin(
    user_uuid: string,
    status: string,
    limit: string,
    offset: string,
    date: string
  ) {
    let params = {
      status,
    };
    let DateQuery = "";
    let StatusQuery = "";
    if (!limit) {
      limit = "1000000000000000";
    }

    if (!offset) {
      offset = "0";
    }

    if (date) {
      let newDate = date.split(",");
      if (newDate.length !== 2) {
        return { message: "please select valide input" };
      }

      DateQuery =
        " AND DATE_format(tags.created_at,:format) between  :date1 AND :date2 ";
      params["date1"] = newDate[0];
      params["date2"] = newDate[1];
      params["format"] = "%d/%m/%Y";
    }

    if (status) {
      StatusQuery = "AND status = :status";
    }

    let tags = await Database.query()
      .select(
        Database.rawQuery(
          "tags.id,tags.name,tags.image_link as image,users.name as author_name,tags.used_in_articles_count, \
           (CASE WHEN tags.status = 10 THEN 'Approved' \
                WHEN tags.status = 20 THEN 'Pending' \
                WHEN tags.status = 30 THEN  'Rejected' \
                END ) as status,DATE_FORMAT(`tags`.`created_at`,'%d/%m/%Y') as date "
        )
      )
      .join("users", "users.uuid", "=", "tags.user_uuid")
      .from("tags")
      .whereRaw(
        Database.rawQuery(
          "tags.is_active = true  " + DateQuery + StatusQuery,
          params
        )
      )
      .orderBy("tags.id", "desc")
      .limit(parseInt(limit))
      .offset(parseFloat(offset));

    return { success: true, tags: tags.length !== 0 ? tags : "tags not found" };
  }
}
