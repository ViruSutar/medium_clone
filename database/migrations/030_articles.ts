import BaseSchema from "@ioc:Adonis/Lucid/Schema";

// TODO: limit the number of images in arrray
export default class Articles extends BaseSchema {
  protected tableName = "articles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.string("title", 100).notNullable();
      table.integer("user_id").unsigned().notNullable();
      table.text("content", "longtext").notNullable();
      table.bigInteger("likes_count").defaultTo(0);
      table.integer("reading_time").notNullable();
      table.boolean("is_active").defaultTo(true);

      table.index(["user_id"], "fk_article_users_idx");

      table
        .foreign("user_id", "fk_articles_users_idx")
        .references("id")
        .inTable("users")
        .onDelete("no action")
        .onUpdate("no action");

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
