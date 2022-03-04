import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public status:number;

  @column()
  public image_link:string;

  @column()
  public user_uuid:string;

  @column()
  public description:string;

  @column()
  public rejection_note:string;

  @column()
  public used_in_articles_count: number;
  
  @column()
  public is_active :boolean

  @column()
  public today_used_in_articles:number;

  @column()
  public weekly_used_in_articles:number;

  @column()
  public date:Date;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
