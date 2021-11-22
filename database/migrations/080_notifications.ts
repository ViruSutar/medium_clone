import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserNotifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.string('message').nullable()
      table.enum('status',['enable','disabled'])
      table.boolean("is_active").defaultTo(true);
      

     table.index(["user_id"],"fk_user_notification_user_idx")
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

      // table
      //   .foreign("user_id","fk_user_notification_user_idx")
      //   .references("id")
      //   .inTable("users")
      //   .onDelete('no action')
      //   .onUpdate('no action')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
