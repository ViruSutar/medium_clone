import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tag from 'App/Models/Tag'

export default class TagSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await Tag.createMany([
      {
        name:"Tech",
        status:"APPROVED",
      },
      {
        name:"Javascript",
        status:"APPROVED",
      },
      {
        name:"Webdevelopment",
        status:"APPROVED",
      },

      {
        name:"Biotech",
        status:"APPROVED",
      },
      {
        name:"Heath",
        status:"APPROVED",
      },
      
    ])
  }
}
