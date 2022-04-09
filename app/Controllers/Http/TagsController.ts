// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TagService from "App/Services/TagService";
import TagValidator from "App/Validators/TagValidator";

export default class TagsController {
  

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

  public async listTags({request,response}){
      let {today_trending,weekly_trending,limit,offset}=request.all()

      let tags=await TagService.listTags(today_trending,weekly_trending,limit,offset)

      if(tags.success === false){
        return response.status(tags.status_code).send({success:false,message:tags.message})
      }

      return response.send({success:true,Data:tags.tags,count:tags.total})
  }

  

  
}
