import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ArticleSubCategory from 'App/Models/ArticleSubCategory'

export default class ArticleSubCategorySeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await ArticleSubCategory.createMany([
      {
        sub_type_name:"Android_dev"
      },
      {
        sub_type_name:"ios_dev"
      },
      {
        sub_type_name:"Biotech"
      },
      {
        sub_type_name:"Climate_change"
      }
    ])
  }
}
