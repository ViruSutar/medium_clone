import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ArticlesImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number


  @column()
  public article_id:number

  @column()
  public image_link:string

  @column()
  public is_cover:boolean
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
