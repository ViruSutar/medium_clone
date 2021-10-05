import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Like from 'App/Models/Like'

export default class LikeSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
   await Like.createMany([
     {
       article_id:1,
       user_id:1
     },
     {
      article_id:6,
      user_id:1
    },
    {
      article_id:7,
      user_id:2
    },
    {
      article_id:5,
      user_id:2
    }
     
   ])

  }
}
