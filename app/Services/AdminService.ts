import Database from "@ioc:Adonis/Lucid/Database";
import { TagEnums } from "App/Enum/TagEnums";
import Tag from "App/Models/Tag";
import NotificationService from "./NotificationService";

export default class AdminService{
    static async listAuthors(limit: string, offset: string,user_uuid:string) {
        let limitQuery = "";
        let offsetQuery = "";
        let params = {};
    
        if (limit != null && limit != "") {
          limitQuery = " limit :limit";
          params["limit"] = parseInt(limit);
        }
    
        if (limit != null && limit != "" && offset != null && offset != "") {
          offsetQuery = " offset :offset";
          params["offset"] = parseInt(offset);
        }
    
        //   TODO: add bio in select
        // TODO: start with design you need clarity
        // TODO: filters

        let authors = await Database.query()
          .select(Database.rawQuery(
            "users.name,users.profile_pic"
          ))
          .from("users")
          .whereRaw(
            Database.rawQuery("users.is_active = 1 AND users.role ='AUTHOR'")
          )
          .limit(parseInt(limitQuery))
          .offset(parseInt(offsetQuery));
    
        return { success: true, Data: authors ? authors : "authors not found" };
      }

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

      static async deleteTag(tag_id: number, user_uuid: string,reason:string) {
        // TODO: check admin and send notification to creator of tag
        let tag = await Tag.find(tag_id);
        if (!tag) {
          return { success: false, status_code: 404, message: "Tag not found" };
        }
    
        tag.is_active = false;
        tag.save();
        let tag_author=tag.user_uuid
      await NotificationService.createNotification(tag_author,"tags", `reason: ${reason}`)
    
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
        if (tag.status === TagEnums.Rejected) {
          return {
            success: false,
            status_code: 400,
            message: "This tag is already rejected",
          };
        }
        tag.status = TagEnums.Rejected;
        tag.rejection_note = rejection_note;
        let message = `Sorry we have requested your tag request for reason  "${rejection_note}"`;
        tag.save();
        let tag_creater_uuid = tag.user_uuid;
        NotificationService.createNotification(tag_creater_uuid, "tags", message);
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
              "tags.id,tags.name,tags.image_link as image,users.name as author_name, \
              tags.today_used_in_articles,tags.weekly_used_in_articles,\
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