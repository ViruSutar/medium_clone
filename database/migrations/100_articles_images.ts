import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ArticlesImages extends BaseSchema {
  protected tableName = 'articles_images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer("article_id").notNullable().unsigned();
      table.string("image_link").nullable()
      table.boolean("is_cover").defaultTo(false)

      table.index(["article_id"], "fk_articles_images_idx");

      table
        .foreign("article_id", "fk_articles_images_idx")
        .references("id")
        .inTable("articles")
        .onDelete("restrict") 
        .onUpdate("restrict");

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
