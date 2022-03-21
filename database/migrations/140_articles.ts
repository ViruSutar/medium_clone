import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Articles extends BaseSchema {
  protected tableName = 'articles'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('trending_articles_date').defaultTo(1).unsigned().alter()

      table.index(["trending_articles_date"], "fk_articles_trending_article_dates_idx");

      table
        .foreign("trending_articles_date", "fk_articles_trending_article_dates_idx")
        .references("id")
        .inTable("trending_articles_dates")
        .onDelete("no action")
        .onUpdate("no action");

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
