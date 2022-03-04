import HttpContext from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class IsAdmin {
  public async handle ({request,response}, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let user_uuid = request.user.user_uuid;
    let user=await User.findBy('uuid',user_uuid) 
    if(user?.role !== 'ADMIN'){
      return response.status(401).send({success:false,messagge:'you do not have this permission'})  
    }
    await next()
  }
}
