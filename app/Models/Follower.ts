import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Follower extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public follower_id: string;

  @column()
  public followee: string;

  @column()
  public is_active: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
