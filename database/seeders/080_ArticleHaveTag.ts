import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ArticleHaveTag from 'App/Models/ArticleHaveTag'

export default class ArticleHaveTagSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await ArticleHaveTag.createMany([
      {
        tag_id:1,
        article_id:"3478fbec-6c44-11ec-9f86-00155d1202b9"
      },
      {
        tag_id:2,
        article_id:"41743447-6c72-11ec-9f86-00155d1202b9"
      },
      {
        tag_id:3,
        article_id:"52082066-6c72-11ec-9f86-00155d1202b9"
      },
      {
        tag_id:1,
        article_id:"aff33b04-6c68-11ec-9f86-00155d1202b9"
      }
    ])
  }
}
