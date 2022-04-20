import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ArticleViews extends BaseSchema {
  protected tableName = 'article_views'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer("article_id").notNullable().unsigned()
      table.date('date_for_seven_days')
      table.date('date_for_thirty_days')
      table.bigInteger('seven_days_views')
      table.bigInteger('thirty_days_views')
      table.bigInteger('overall_views')
      
      table.index(["article_id"], "fk_article_views_article_id_idx");

      table
        .foreign("article_id", "fk_article_views_article_id_idx")
        .references("id")
        .inTable("articles")
        .onDelete("no action")
        .onUpdate("no action");

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
