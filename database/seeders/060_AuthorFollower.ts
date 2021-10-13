import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AuthorFollower from 'App/Models/AuthorFollower'

export default class AuthorFollowerSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
   await  AuthorFollower.createMany([
     {
      follower_id:4,
      author_id:1
     },
     {
      follower_id:5,
      author_id:1
    },
    {
      follower_id:6,
      author_id:1
    },
    {
      follower_id:7,
      author_id:2
    },
    {
      follower_id:9,
      author_id:2
    },
    {
      follower_id:5,
      author_id:3
    },
    {
      follower_id:6,
      author_id:3
    },
    {
      follower_id:7,
      author_id:3
    }
   ])
  }
}
