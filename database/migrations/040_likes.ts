import Database from "@ioc:Adonis/Lucid/Database";
import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Likes extends BaseSchema {
  protected tableName = "likes";

  public async up() {
    // TODO: unique index query works from workbench but we need to find a way to insert that from here
    this.schema.createTable(this.tableName, (table) => {
      table.increments("like_id").notNullable();
      table.uuid("article_id").notNullable();
      table.uuid("user_id").notNullable();

        // Database.rawQuery('create unique index  combo_usr_art_idx on likes(article_id, user_id)')
      // table.index(["article_id"], "fk_like_articles_idx");
      // table.index(["user_id"], "fk_like_users_idx");
 
      // table.queryContext('ALTER TABLE likes ADD CONSTRAINT likes UNIQUE(article_id, user_id)')
      // table.queryContext('create unique index  combo_usr_art_idx on likes(article_id, user_id) ')
        // this.schema.raw('ALTER TABLE likes ADD CONSTRAINT likes UNIQUE(article_id, user_id)') TODO:


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

      // Database.rawQuery('ALTER TABLE likes ADD CONSTRAINT likes UNIQUE(article_id, user_id)')

    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
