import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Article from 'App/Models/Article'

export default class ArticleSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Article.createMany([
      {
        title:"How to be Android developer",
        user_id:1,
        article_type:"Programming",
        sub_category_id:1,
        content:"One of the best parts about developing for Android is that the necessary tools are free and easy to obtain. The Android SDK is available via free-of-charge download, as is Android Studio, the official integrated development environment (IDE) for Android app development.  \
                 Android Studio is the main program developers use to write code and assemble their apps from various packages and libraries. The Android SDK includes sample code, software libraries, handy coding tools, and much more to help you build, test, and debug Android applications.\
                 Another highlight of developing for Android is the ease of the process of submitting apps.Once you’re ready to submit your app to the Google Play store, register for a Google Play publisher account (that includes paying a $25 fee), follow Android’s launch checklist, submit",
                 
        image:"https://dvokhk8ohqhd8.cloudfront.net/assets/engineering_types/android/hero_image-fc5b7ec3e1de4498f823edc8ed1d345d16e52de1c2b4be98d3fb26df086df117.svg"

      },{
        title:"How to be web developer",
        article_type:"Programming",
        user_id:2,
        sub_category_id:1,
        content:"One of the best parts about developing for Android is that the necessary tools are free and easy to obtain. The Android SDK is available via free-of-charge download, as is Android Studio, the official integrated development environment (IDE) for Android app development.  \
                 Android Studio is the main program developers use to write code and assemble their apps from various packages and libraries. The Android SDK includes sample code, software libraries, handy coding tools, and much more to help you build, test, and debug Android applications.\
                 Another highlight of developing for Android is the ease of the process of submitting apps.Once you’re ready to submit your app to the Google Play store, register for a Google Play publisher account (that includes paying a $25 fee), follow Android’s launch checklist, submit",
                 
        image:"https://dvokhk8ohqhd8.cloudfront.net/assets/engineering_types/android/hero_image-fc5b7ec3e1de4498f823edc8ed1d345d16e52de1c2b4be98d3fb26df086df117.svg"
      },
      {
        title:"what is science",
        article_type:"Science",
        user_id:3,
        sub_category_id:1,
        content:"One of the best parts about developing for Android is that the necessary tools are free and easy to obtain. The Android SDK is available via free-of-charge download, as is Android Studio, the official integrated development environment (IDE) for Android app development.  \
                 Android Studio is the main program developers use to write code and assemble their apps from various packages and libraries. The Android SDK includes sample code, software libraries, handy coding tools, and much more to help you build, test, and debug Android applications.\
                 Another highlight of developing for Android is the ease of the process of submitting apps.Once you’re ready to submit your app to the Google Play store, register for a Google Play publisher account (that includes paying a $25 fee), follow Android’s launch checklist, submit",
                 
        image:"https://dvokhk8ohqhd8.cloudfront.net/assets/engineering_types/android/hero_image-fc5b7ec3e1de4498f823edc8ed1d345d16e52de1c2b4be98d3fb26df086df117.svg"
      }
    ])
  }
}
