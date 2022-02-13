import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";

export default class CheckAccess {
  public async handle ({request,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
   const token=request.header('Authorization')
   console.log(token);
   
   if(token){
    const decode= jwt.verify(token,Env.get('SECRET_KEY'))
    request['user']=decode
   }
   else{
     return response.status(401).send({success:false,messagge:'Access denied'})
   }
  
  await next()     
  }
}
 