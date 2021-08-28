import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Likes extends BaseSchema {
  protected tableName = "likes";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("like_id").notNullable();
      table.integer("article_id").unsigned().notNullable();
      table.integer("user_id").unsigned().notNullable();
      table.boolean('is_active').defaultTo(true)


      table.index(["article_id"], "fk_like_articles_idx");
      table.index(["user_id"], "fk_like_users_idx");

      table
        .foreign("article_id", "fk_articles_idx")
        .references("id")
        .inTable("articles")
        .onDelete("restrict")
        .onUpdate("restrict");

      table
        .foreign("user_id", "fk_users_idx")
        .references("id")
        .inTable("users")
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
