import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Replies extends BaseSchema {
  protected tableName = 'replies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('comment_id').unsigned().notNullable()
      table.string('reply').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */


      table.index(["comment_id"],"fk_replies_comment_idx")

      table.foreign("comment_id","fk_replies_comment_idx")
           .references("id")
           .inTable("comments")
           .onDelete("restrict") 
           .onUpdate("restrict");
           
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
