import Database from "@ioc:Adonis/Lucid/Database";
import { TagEnums } from "App/Enum/TagEnums";
import Tag from "App/Models/Tag";

export default class TagService {
  static async createTag(tag_name, user_uuid) {
    //  TODO: check if user is admin

  let tag=await Tag.create({
      name: tag_name,
      status: TagEnums.Pending,
    });

    return { success: true,tagId:tag.id };
  }

  static async searchTags(tag_name) {
      let params={
          status:TagEnums.Approved,
          tag_name:tag_name + '%'
      }

        let tags=await Database.query()
        .select(Database.rawQuery('tags.name'))
        .from('tags')
        .whereRaw(Database.rawQuery('tags.status = :status AND tags.name LIKE ',params))

        return {success:true,tags}
  }

  //  TODO:do we need most used tags there is column used_in_articles_count
  static async listTags() {
    // TODO: tag image needed 
    let tags=await Tag.query().select("name","used_in_articles_count")

    return {success:true,tags:tags ? tags :'no tags found'}
  }

  static async deleteTag(tag_id,user_uuid) {
    //  TODO: check if user is admin
    let tag = await Tag.find(tag_id);
    if(!tag){
        return {success:false,status_code:404,message:'Tag not found'}
    }
 
    tag.delete()
    tag.save()

    return {success:true}
    
  }

  static async updateTag(tag_id,name,status, user_uuid) {
    //  TODO: check if user is admin

    let tag = await Tag.find(tag_id);
    if(!tag){
        return {success:false,status_code:404,message:'Tag not found'}
    }
    let enum_status:any=TagEnums[status]
    if(name) tag.name=name
    if(status) tag.status=enum_status
    tag.save()
    
  }
}
