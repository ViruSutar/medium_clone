import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import {v4 as uuid} from 'uuid'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number


  @column()
  public uuid:string

 
  @column()
  public name:string

  @column()
  public role:string

  @column()
  public email:string

  @column()
  public password:string

  @column()
  public bookmark_id:string

  @column()
  public is_active :boolean

  
  @column()
  public cover_pic:string

  
  @column()
  public profile_pic:string

  
  @column()
  public twitter_link:string

  
  @column()
  public instagram_link:string

  
  @column()
  public linkedin_link:string

  @column()
  public personal_website_link:string

  @column()
  public user_bio:string



  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }


  @beforeCreate()
  public static async createUUID(model:User){
    model.uuid= uuid()
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
