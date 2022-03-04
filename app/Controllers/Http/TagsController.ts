// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TagService from "App/Services/TagService";
import TagValidator from "App/Validators/TagValidator";

export default class TagsController {
  public async createTag({ request, response }) {
    let { tag_name, image_link, description } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(TagValidator.createTag);
    let tag = await TagService.createTag(
      tag_name,
      user_uuid,
      image_link,
      description
    );

    return response.status(200).send({ success: true, tagId: tag.tagId });
  }

  public async searchTag({ request, response }) {
    let { tag_name } = request.all();
    await request.validate(TagValidator.searchTag);

    let tag = await TagService.searchTags(tag_name);

    return response.send({ success: true, tag: tag.tags });
  }

  public async RequestForTag({ request, response }) {
    let { tag_name, description, image_link } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(TagValidator.createTag);

    let tag = await TagService.RequestForTag(
      tag_name,
      description,
      image_link,
      user_uuid
    );  

    if (tag.success === false) {
      return response
        .status(tag.status_code)
        .send({ success: false, message: tag.message });
    }

    return response.send({ success: true });
  }

  // public async listTags({request,response}){
  //     let {}=request.all()
  // }

  public async deleteTag({ request, response }) {
    let { tag_id } = request.all();
    let user_uuid = request.user.user_uuid;

    let tag = await TagService.deleteTag(tag_id, user_uuid);

    if (tag.success === false) {
      return response
        .status(tag.status_code)
        .send({ success: false, message: tag.message });
    }

    return response.send({ success: true, message: tag.message });
  }

  public async updateTag({request,response}){
      let {tag_id, tag_name, status,image_link}=request.all()

      await request.validate(TagValidator.updateTag)

      let tag=await TagService.updateTag(tag_id, tag_name, status,image_link)

      if(tag?.success === false){
          return response.status(tag.status_code).send({success:false,message:tag.message})
      }

      return response.send({success:true,messsage:tag?.message})
  }

  public async listTagsAdmin({request,response}){
    let {limit,offset,status,date}=request.all()
    let user_uuid = request.user.user_uuid;
   
    let tags=await TagService.listTagsAdmin(user_uuid,status,limit,offset,date)

    return response.send({success:true,tags:tags.tags})
  }

  public async rejectTag({request,response}){
    let {tag_id,rejection_note}=request.all()
    
    await request.validate(TagValidator.rejectTag)

    let tag=await TagService.rejectTag(tag_id,rejection_note)

    if(tag?.success === false){
      return response.status(tag.status_code).send({success:false,message:tag.message})
    }

    return response.send({success:true})
  }
}
