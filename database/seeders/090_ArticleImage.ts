import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ArticlesImage from 'App/Models/ArticlesImage'

export default class ArticleImageSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await ArticlesImage.createMany([
      {
        article_id:"3478fbec-6c44-11ec-9f86-00155d1202b9",
        image_link:"https://image.jpg.com",
        is_cover:true
      },
      {
        article_id:"3478fbec-6c44-11ec-9f86-00155d1202b9",
        image_link:"https://image.jpg.com",
        is_cover:false
      },
      {
        article_id:"3478fbec-6c44-11ec-9f86-00155d1202b9",
        image_link:"https://image.jpg.com",
        is_cover:false
      },
      {
        article_id:"78e82372-6c68-11ec-9f86-00155d1202b9",
        image_link:"https://image.jpg.com",
        is_cover:true
      }
    ])
  }
}
