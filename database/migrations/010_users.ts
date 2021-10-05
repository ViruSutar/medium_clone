import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  //TODO: book mark array of ids
  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').nullable()
      table.enum('role',['AUTHOR','READER','ADMIN']).defaultTo('READER')
      table.string('email').unique().notNullable()
      table.string('password').nullable()
      table.integer('followers').defaultTo(0) //only authors will have followers
      table.boolean('is_active').defaultTo(true)



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