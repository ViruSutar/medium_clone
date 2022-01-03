import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class ArticleTags extends BaseSchema {
  protected tableName = "article_tags";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("tag");
      table.integer('article_id').notNullable().unsigned()


      table.index(["article_id"], "fk_articles_tags_idx");

      table
        .foreign("article_id", "fk_articles_tags_idx")
        .references("id")
        .inTable("articles")
        .onDelete("restrict") 
        .onUpdate("restrict");

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
