import Database from '@ioc:Adonis/Lucid/Database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

// TODO: limit the number of images in arrray
export default class Articles extends BaseSchema {
  protected tableName = "articles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.string('title',100).notNullable()
      table.string('author_id').notNullable()
      table.integer('reading_time').notNullable()
      table.boolean('is_private').defaultTo(0)
      table.boolean('is_draft').defaultTo(0)
      table.text('content','longtext').notNullable()
      table.bigInteger('likes_count').defaultTo(0)
      table.bigInteger('views').nullable()
      table.boolean('is_active').defaultTo(true)

      table.index(["author_id"], "fk_article_author_idx");

      table
      .foreign("author_id", "fk_articles_author_idx")
      .references("uuid")
      .inTable("users")
      .onDelete('no action')
      .onUpdate('no action')
      

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
