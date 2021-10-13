import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Bookmarks extends BaseSchema {
  protected tableName = "bookmarks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id")
      table.integer("user_id").unsigned().notNullable()
      table.string("bookmark_type").nullable() //this is the folders where user can create and categories bookmarks
      table.integer("bookmark_id").unsigned().notNullable()

      table.unique(["user_id", "bookmark_id"], "fk_bookmarks_combo_idx");

      table
        .foreign("user_id", "fk_bookmarks_user_idx")
        .references("id")
        .inTable("users")
        .onDelete("no action")
        .onUpdate("no action");

      table
        .foreign("bookmark_id", "fk_bookmarks_bookmark_idx")
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
