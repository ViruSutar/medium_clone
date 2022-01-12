import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public author_id: number;

  @column()
  public article_tags: string;

  @column()
  public content: string;

  @column()
  public is_active: boolean;

  @column()
  public is_private: boolean;

  @column()
  public is_draft: boolean;

  @column()
  public likes_count:number;

  @column()
  public views: number;

  @column()
  public reading_time: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
