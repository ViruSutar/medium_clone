import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AuthorFollower from 'App/Models/AuthorFollower'

export default class AuthorFollowerSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
   await  AuthorFollower.createMany([
     {
       author_id:1,
       followers_id:"[2,3]",
       article_id:5
     },
     {
      author_id:2,
      followers_id:"[1,3]",
      article_id:6
    }
   ])
  }
}
