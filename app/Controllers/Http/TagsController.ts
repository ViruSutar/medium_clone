// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TagService from "App/Services/TagService"
import TagValidator from "App/Validators/TagValidator"

export default class TagsController {
    public async createTag({request,response}){
        let {tag_name,image}=request.all()
        let user_uuid = request.user.user_uuid;
        
        await request.validate(TagValidator.createTag)
        let tag=await TagService.createTag(tag_name,user_uuid)

        return response.status(200).send({success:true,tagId:tag.tagId})
    }

    public async searchTag({request,response}){
        let {tag_name}=request.all()
        await request.validate(TagValidator.searchTag)

        let tag=await TagService.searchTags(tag_name)
       
        return response.send({success:true,tag:tag.tags})

        
    }
}
