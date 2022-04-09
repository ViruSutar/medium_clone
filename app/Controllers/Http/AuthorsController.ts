// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AuthorService from "App/Services/AuthorService"

export default class AuthorsController {
   public async  listAuthors({request,response}){
       let {limit,offset}=request.all()

       let data=await AuthorService.listAuthors(limit,offset)

       return response.send({success:true,data:data.Data,total:data.total})
   }
}
