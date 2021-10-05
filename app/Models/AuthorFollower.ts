import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AuthorFollower extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public follower_id:number

  @column()
  public followee_id:string

  @column()
  public is_active:boolean


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
