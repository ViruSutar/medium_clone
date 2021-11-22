import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Replies extends BaseSchema {
  protected tableName = 'replies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('reply')
      table.integer('comment_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.boolean('is_active').defaultTo(true)

      table.index(["comment_id"],"fk_replies_comment_idx")
      table.index(["user_id"], "fk_replies_user_idx");


      table
      .foreign("user_id", "fk_replies_user_idx")
      .references("id")
      .inTable("users")
      .onDelete('no action')
      .onUpdate('no action')


      table
      .foreign("comment_id", "fk_replies_comment_idx")
      .references("id")
      .inTable("comments")
      .onDelete('no action')
      .onUpdate('no action')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
