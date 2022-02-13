import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class SubscribersLists extends BaseSchema {
  protected tableName = "subscribers_lists";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.uuid("author_id").notNullable();
      table.uuid("user_uuid").notNullable();

      table.index(["author_id"], "fk_subscribers_lists_author_id_idx");
      table.index(["user_uuid"], "fk_subscribers_lists_user_uuid_idx");

      table
        .foreign("author_id", "fk_subscribers_lists_author_id_idx")
        .references("uuid")
        .inTable("users")
        .onDelete("no action")
        .onUpdate("no action");

      table
        .foreign("user_uuid", "fk_subscribers_lists_user_uuid_idx")
        .references("uuid")
        .inTable("users")
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
