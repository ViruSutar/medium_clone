import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Articles extends BaseSchema {
  protected tableName = 'articles'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('title',100).nullable().alter()
      table.text('content','longtext').nullable().alter()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
