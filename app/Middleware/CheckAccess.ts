import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAccess {
  public async handle ({request,response,session}: HttpContextContract, next: () => Promise<void>,props) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let access= session.get('auth')

    if(!access){
      return response.status(403).send({message:"Please login"})
    }
    let role = access.role
    

    for (let i = 0; i < props.length; i++) {
      if (!role.includes(props[i])) {
        return response.send({ success: false, message: 'You Do not have permission to access this route' })
      }
    }
  await next()     
  }
}
