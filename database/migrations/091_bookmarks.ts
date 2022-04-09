import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bookmarks extends BaseSchema {
  protected tableName = 'bookmarks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("bookmark_folder").defaultTo("Reading List")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
