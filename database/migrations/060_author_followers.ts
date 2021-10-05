import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class WriterFollowers extends BaseSchema {
  protected tableName = "author_followers";

  // TODO: when you create a user and if he becoms author push him into this table
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.integer("follower_id").unsigned().notNullable();
      table.integer("followee_id").unsigned().notNullable();
      table.boolean("is_active").defaultTo(true);

      table.unique(["follower_id","followee_id"], "fk_follower_followee__idx");
      // table.index(["followee_id"], "fk_followee_id_idx");

      table
        .foreign("follower_id", "fk_follower_id_idx")
        .references("id")
        .inTable("users")
        .onDelete("restrict")
        .onUpdate("restrict");

      table
        .foreign("followee_id", "fk_followee_id_idx")
        .references("id")
        .inTable("users")
        .onDelete("restrict")
        .onUpdate("restrict");

      // this.schema.raw('')

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
