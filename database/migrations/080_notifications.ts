import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserNotifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('to').notNullable()
      table.string('message').nullable()
      // table.enum('type',["reply","author"])
      table.boolean("is_active").defaultTo(true);
      

     table.index(["to"],"fk_user_notification_tox")
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

      table
        .foreign("to","fk_user_notification_tox")
        .references("id")
        .inTable("users")
        .onDelete('no action')
        .onUpdate('no action')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
