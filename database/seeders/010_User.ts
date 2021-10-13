import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name:"viraj",
        email:"viraj@gmail.com",
      },
      {
        name:"dota",
        email:"dota@gmail.com",
      },
      {
        name:"user3",
        email:"user3@gmail.com",
      },
      {
        name:"user4",
        email:"user4@gmail.com",
      }, {
        name:"pubg",
        email:"pubg@gmail.com",
      },
      {
        name:"newuser",
        email:"newuser@gmail.com",
      },
    ])
  }
}
