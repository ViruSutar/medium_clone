import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";

export default class CheckAccess {
  public async handle ({request,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
   const token=request.header('Authorization')
   
   if(token){
    const decode= jwt.verify(token,Env.get('SECRET_KEY'))
    request['user']=decode
   }
   else{
    //  TODO: if not logged in redirect to login page
     return response.status(401).send({success:false,messagge:'please login or create new account'})
   }
  
  await next()     
  }
}
 