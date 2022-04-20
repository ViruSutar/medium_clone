import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { Moment } from 'moment'

export default class ArticleView extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public article_id:number

  @column()
  public date_for_seven_days:string

  @column()
  public date_for_thirty_days:string

  @column()
  public seven_days_views:number

  @column()
  public thirty_days_views:number

  @column()
  public overall_views:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
