import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name:"admin",
        email:"admin@gmail.com",
        role:"ADMIN"
      },
      {
        name:"user1",
        email:"user1@gmail.com",
        bookmark_id:"[1,2,3]"
      },
      {
        name:"user2",
        email:"user2@gmail.com",
      },

    ])
  }
}
