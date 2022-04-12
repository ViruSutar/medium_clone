// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AuthorService from "App/Services/AuthorService"
import AuthorValidator from "App/Validators/AuthorValidator";


export default class AuthorsController {
   public async  listAuthors({request,response}){
       let {limit,offset}=request.all()

       let data=await AuthorService.listAuthors(limit,offset)

       return response.send({success:true,data:data.Data,total:data.total})
   }

   public async getAuthorDetails({request,response}){
    let {author_uuid}=request.all()
    // let user_uuid = request.user.user_uuid
   await request.validate(AuthorValidator.getAuthorDetails)
    let data=await AuthorService.getAuthorDetails(author_uuid)

    return {success:true,data}
  
  }
}
