import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Notifications extends BaseSchema {
  protected tableName = "notifications";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.uuid("user_uuid").notNullable();
      table.boolean('type').notNullable()
      table.string("notification");
 
      table.index(["user_uuid"], "fk_notification_user_uuid_idx");

      table
        .foreign("user_uuid", "fk_notification_to_idx")
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
