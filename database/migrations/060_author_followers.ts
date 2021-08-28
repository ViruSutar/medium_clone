import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WriterFollowers extends BaseSchema {
  protected tableName = 'author_followers'

  // TODO: when you create a user and if he becoms author push him into this table 
  // TODO: make authors table store followers and their likes ,articles written by total numbers of like  
  // TODO: but user should not follow hime self,also show which author follows whome
  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('author_id').unsigned().notNullable()
      table.json('followers_id').nullable()
      table.integer('article_id').unsigned().nullable()
      table.boolean('is_active').defaultTo(true)


     table.index(["author_id"],'fk_author_users_idx')
     table.index(["article_id"],'fk_article_articles_idx')

     
      table
      .foreign("author_id", "fk_author_users_idx")
      .references("id")
      .inTable("users")
      .onDelete("restrict")
      .onUpdate("restrict")

      table
       .foreign("article_id", "fk_article_articles_idx")
       .references("id")
       .inTable("articles")
       .onDelete("restrict")
       .onUpdate("restrict")


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
