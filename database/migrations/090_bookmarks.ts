import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Bookmarks extends BaseSchema {
  protected tableName = "bookmarks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id")
      table.uuid("user_id").notNullable()
      table.string("bookmark_type").nullable() //this is the folders where user can create and categories bookmarks
      table.uuid("article_id").notNullable()

      table.index(["user_id"], "fk_bookmarks_user_idx");
      table.index([ "article_id"], "fk_bookmarks_article_idx");


      table
        .foreign("user_id", "fk_bookmarks_user_idx")
        .references("id")
        .inTable("users")
        .onDelete("no action")
        .onUpdate("no action");

      table
        .foreign("article_id", "fk_bookmarks_article_idx")
        .references("id")
        .inTable("articles")
        .onDelete("no action")
        .onUpdate("no action");

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
