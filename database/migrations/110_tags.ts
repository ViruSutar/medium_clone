import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Tags extends BaseSchema {
  protected tableName = "tags";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.boolean("status").defaultTo(20);
      table.string("description").notNullable();
      table.string("image_link").notNullable();
      table.string("user_uuid").notNullable();
      table.string("rejection_note").nullable();
      table.date("today_date")
      table.bigInteger("today_used_in_articles").defaultTo(0)
      table.bigInteger("weekly_used_in_articles").defaultTo(0)
      table.date('weekly_date').comment('column used to check weekly used tags')
      table.bigInteger("used_in_articles").defaultTo(0)
      table.boolean('is_active').defaultTo(true)

      table.index(["user_uuid"], "fk_tags_user_uuidx");

      table
        .foreign("user_uuid", "fk_articles_user_uuidx")
        .references("uuid")
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
