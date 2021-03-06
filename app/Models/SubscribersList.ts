import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SubscribersList extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_uuid:string

  @column()
  public author_id:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
