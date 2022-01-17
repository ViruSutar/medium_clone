import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Comments extends BaseSchema {
  protected tableName = "comments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.uuid("user_id").notNullable();
      table.integer("article_id").notNullable().unsigned();
      table.string("comment", 100).nullable();
      table.boolean('is_active').defaultTo(true)


      table.index(["article_id"], "fk_comment_articles_idx");
      table.index(["user_id"], "fk_comment_users_idx");

      table
        .foreign("article_id", "fk_comment_articles_idx")
        .references("id")
        .inTable("articles")
        .onDelete("restrict") 
        .onUpdate("restrict");

      table
        .foreign("user_id", "fk_comment_users_idx")
        .references("uuid")
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
