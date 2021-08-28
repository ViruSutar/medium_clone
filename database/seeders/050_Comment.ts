import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Comment from 'App/Models/Comment'

export default class CommentSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Comment.createMany([
      {
        user_id:1,
        article_id:5,
        comment:"Nice article found helful"
      },
      {
        user_id:2,
        article_id:6,
        comment:"Beatifully written"
      },
      {
        user_id:3,
        article_id:7,
        comment:"Wow"
      },
      {
        user_id:2,
        article_id:5,
        comment:"Wow beautiful"
      }
    ])
  }
}
