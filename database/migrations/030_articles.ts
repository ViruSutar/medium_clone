<<<<<<< HEAD
import BaseSchema from "@ioc:Adonis/Lucid/Schema";
=======
import Database from '@ioc:Adonis/Lucid/Database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'
>>>>>>> 8ddb95420d03e677cbae2c2b67f4753ecbcfc579

// TODO: limit the number of images in arrray
export default class Articles extends BaseSchema {
  protected tableName = "articles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
<<<<<<< HEAD
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
=======
      table.uuid('id').notNullable().unique().defaultTo(Database.knexRawQuery("(UUID())"))
      table.string('title',100).notNullable()
      table.string('author_id').notNullable()
      table.integer('reading_time').notNullable()
      table.boolean('is_private').defaultTo(0)
      table.text('content','longtext').notNullable()
      table.bigInteger('likes_count').defaultTo(0)
      table.bigInteger('views').nullable()
      table.boolean('is_active').defaultTo(true)

      table.index(["author_id"], "fk_article_author_idx");

      table
      .foreign("author_id", "fk_articles_author_idx")
      .references("id")
      .inTable("users")
      .onDelete('no action')
      .onUpdate('no action')
>>>>>>> 8ddb95420d03e677cbae2c2b67f4753ecbcfc579

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
