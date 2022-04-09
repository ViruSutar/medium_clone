import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("twitter_link").nullable()
      table.string("instagram_link").nullable()
      table.string("linkedIn_link").nullable()
      table.string("personal_website_link").nullable()
      table.string('remember_me_token').nullable()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
