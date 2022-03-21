import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TrendingArticlesDates extends BaseSchema {
  protected tableName = 'trending_articles_dates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

     table.date('weekly_date')
     table.date('monthly_date')
     table.date('quarterly_date')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
