import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ArticleSubCategory from 'App/Models/ArticleSubCategory'

export default class ArticleSubCategorySeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await ArticleSubCategory.createMany([
      {
        sub_categories:"Android_dev"
      },
      {
        sub_categories:"ios_dev"
      },
      {
        sub_categories:"Biotech"
      },
      {
        sub_categories:"Climate_change"
      }
    ])
  }
}
