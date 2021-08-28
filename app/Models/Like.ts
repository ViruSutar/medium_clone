import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public like_id: number;

  @column()
  public article_id: number;

  @column()
  public user_id: number;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
