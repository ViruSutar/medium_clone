import Database from '@ioc:Adonis/Lucid/Database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  //TODO: book mark array of ids
  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.uuid('uuid').unique().notNullable() 
      table.string('name').notNullable()
      table.enum('role',['AUTHOR','READER','ADMIN']).defaultTo('READER')
      table.bigInteger('follower_count').defaultTo(0) //only authors will have followers
      table.bigInteger('followee_count').defaultTo(0) //only authors will have followers
      table.boolean('is_active').defaultTo(true)
      table.string('cover_pic').nullable()
      table.string('profile_pic').nullable()
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()

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
