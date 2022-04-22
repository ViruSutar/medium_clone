"use strict";

import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import ArticlesImage from "App/Models/ArticlesImage";
import ArticleTag from "App/Models/ArticleTag";
import ArticleView from "App/Models/ArticleView";
import Follower from "App/Models/Follower";
import User from "App/Models/User";
import readingTime from "reading-time";
import NotificationService from "./NotificationService";
import moment from "moment";

class ArticleService {
  static async createArticle(title, content, images, author_id, tags) {
    let reading_time = readingTime(content);
    let value: number = 0;

    let author = await User.findBy("uuid", author_id);

    if (!author) {
      return { success: false, message: "User not found" };
    }

    let find_user = await User.query()
      .where("uuid", author_id)
      .where("is_active", true);

    if (find_user.length === 0) {
      return { success: false, status_code: 404, message: "User not found" };
    }

    if (images.length >= 4) {
      value = 1;
    }

    let article = await Article.create({
      title,
      content,
      author_id: author_id,
      reading_time:
        Math.round(reading_time.minutes) === 0
          ? 1
          : Math.round(reading_time.minutes) + value,
    });
    let articleId = article.id;

    tags &&
      tags.map(async (tagId) => {
        //  TODO: run cron job to reset weekly and today columns

        await ArticleTag.create({
          tag_id: tagId,
          article_id: articleId,
        });

        await Database.rawQuery(
          'update tags set \
          tags.weekly_date = IF(tags.weekly_date IS NULL ,curdate(),tags.weekly_date),\
           tags.today_used_in_articles = tags.today_used_in_articles + 1,\
           tags.weekly_used_in_articles = IF(DATE_ADD(tags.weekly_date, INTERVAL 7 DAY) >= DATE_FORMAT(CURDATE(),"%Y-%m-%d"),\
           tags.weekly_used_in_articles + 1,tags.weekly_used_in_articles), \
           tags.used_in_articles = tags.used_in_articles + 1  \
           where tags.id = :tagId',
          { tagId }
        );
      });

    images &&
      images.map((data) => {
        ArticlesImage.create({
          article_id: articleId,
          image_link: data.image_link,
          is_cover: data.is_cover,
        });
      });

    if (author.role !== "ADMIN") {
      author.role = "AUTHOR";
      author.save();
    }

    let followers = await Follower.query().where("followee", author_id);
    let author_name = author.name;
    if (followers) {
      await followers.map(async (data) => {
        let followers = data.follower_id;
        let message = `${author_name} has published new blog ${title}`;
        NotificationService.createNotification(followers, "article", message);
      });
    }

    // TODO: use set date function to add date
    let seven_days = moment(new Date(), "YYYY-MM-DD")
      .add("7", "days")
      .format("YYYY-MM-DD");
    let thirty_days = moment(new Date(), "YYYY-MM-DD")
      .add("30", "days")
      .format("YYYY-MM-DD");

    await ArticleView.create({
      article_id: article.id,
      date_for_seven_days: seven_days,
      date_for_thirty_days: thirty_days,
    });

    return {
      success: true,
      articleId: article.id,
    };
  }

  static async listArticles(
    limit,
    offset,
    article_tag,
    sort_by_date,
    author_name,
    user_uuid,
    weekly_trending,
    monthly_trending,
    quarterly_trending,
    sort_by_views
  ) {
    if (user_uuid === null) {
      user_uuid = null;
    }

    let limitQuery = "";
    let offsetQuery = "";
    let tagQuery = "";
    let authorNameQuery = "";
    let orderByLikes = "";
    let orderById = "Order By articles.id  desc ";
    let orderByDate = " ";
    let params = { user_uuid };
    let weeklyTrendingQuery = "";
    let monthlyTrendingQuery = "";
    let quarterlyTrendingQuery = "";
    let orderByViewsQuery;
    if (limit != null && limit != "") {
      limitQuery = " limit :limit";
      params["limit"] = parseInt(limit);
    }

    if (limit != null && limit != "" && offset != null && offset != "") {
      offsetQuery = " offset :offset";
      params["offset"] = parseInt(offset);
    }

    // if(weekly_trending === "true" &&  monthly_trending === "true" && quarterly_trending === "true" &&
    // sort_by_likes === "true" && sort_by_date === "true" ){
    //  return
    // }

    if (article_tag) {
      tagQuery = " AND tags.name = :article_tag  ";
      params["article_tag"] = article_tag;
    }

    // if (sort_by_likes === 'tr') {
    //   //use limit 5 to get top 5 trending articles
    //   //  TODO: this query  should run only once a day so the we can set todays top 5 articles
    //   orderById = "";
    //   orderByLikes = " order by articles.likes_count desc ";
    // }

    if(sort_by_views){
      orderById = "";
      orderByViewsQuery = "order by article_views.overall_views " + sort_by_views
    }

    if (sort_by_date != null && sort_by_date != "") {
      orderById = "";
      orderByDate = " order by articles.created_at " + sort_by_date;
    }

    if (author_name != null && author_name != "") {
      params["author_name"] = author_name;
      authorNameQuery = " AND users.name = :author_name ";
    }

    if (weekly_trending === "true") {
      orderByLikes = "";
      monthlyTrendingQuery = "";
      quarterlyTrendingQuery = "";
      orderById = "";
      orderByDate = "";
      weeklyTrendingQuery =
        ' AND  date_add(trending_articles_dates.weekly_date ,INTERVAL 7 DAY) >= DATE_FORMAT(articles.created_at,"%Y-%m-%d") \
                             AND trending_articles_dates.weekly_date <= DATE_FORMAT(articles.created_at,"%Y-%m-%d") ';

      orderByLikes = " order by articles.likes_count desc ";
    }

    if (monthly_trending === "true") {
      orderByLikes = "";
      weeklyTrendingQuery = "";
      quarterlyTrendingQuery = "";
      orderById = "";
      orderByDate = "";
      monthlyTrendingQuery =
        ' AND  date_add(trending_articles_dates.monthly_date ,INTERVAL 30 DAY) >= DATE_FORMAT(articles.created_at,"%Y-%m-%d") \
                             AND trending_articles_dates.monthly_date <= DATE_FORMAT(articles.created_at,"%Y-%m-%d") ';

      orderByLikes = " order by articles.likes_count desc ";
    }

    if (quarterly_trending === "true") {
      orderByLikes = "";
      monthlyTrendingQuery = "";
      weeklyTrendingQuery = "";
      orderById = "";
      orderByDate = "";
      quarterlyTrendingQuery =
        ' AND  date_add(trending_articles_dates.quarterly_date ,INTERVAL 90 DAY) >= DATE_FORMAT(articles.created_at,"%Y-%m-%d") \
                             AND trending_articles_dates.quarterly_date <= DATE_FORMAT(articles.created_at,"%Y-%m-%d") ';

      orderByLikes = " order by articles.likes_count desc ";
    }

    let [data, total] = await Promise.all([
      Database.rawQuery(
        'select users.name as author_name, articles.title,articles.id as article_id,SUBSTRING(articles.content,1,200) as content,  \
                    articles.likes_count,articles.comments_count, DATE_FORMAT(articles.created_at,"%d/%m/%Y") as Date,\
                    articles_images.image_link as image,JSON_ARRAYAGG(tags.name) as tag_name,articles.reading_time,\
                    if((select id from likes where article_id = articles.id AND user_id = :user_uuid) is not null ,true,false)\
                    as is_liked ,if((select id from bookmarks where article_id = articles.id AND user_id = :user_uuid) is not null ,true,false)\
                    as is_bookmarked,if(article_views.overall_views is null ,0,article_views.overall_views) as article_views\
                     from articles \
                     join users on users.uuid=articles.author_id \
                     left join articles_images on articles_images.article_id = articles.id and is_cover = 1\
                     left join  article_tags on  article_tags.article_id = articles.id\
                     left join tags on article_tags.tag_id = tags.id \
                     left join trending_articles_dates on trending_articles_dates.id = articles.trending_articles_date\
                     left join article_views on article_views.article_id = articles.id \
                     where articles.is_active = 1 AND articles.is_draft = 0 \
                      ' +
          weeklyTrendingQuery +
          monthlyTrendingQuery +
          quarterlyTrendingQuery +
          tagQuery +
          authorNameQuery +
          " group by articles.id " +
          orderById +
          orderByLikes +
          orderByDate +
          orderByViewsQuery + 
          limitQuery +
          offsetQuery,
        params
      ).then((data) => {
        return data[0].map((articles) => {
          articles.tag_name = JSON.parse(articles.tag_name);
          return articles;
        });
      }),
      Database.rawQuery(
        "select count(distinct articles.id) as count \
                     from articles \
                     join users on users.uuid=articles.author_id \
                     left join articles_images on articles_images.article_id = articles.id and is_cover = 1 \
                     left join  article_tags on  article_tags.article_id = articles.id\
                     left join trending_articles_dates on trending_articles_dates.id = articles.trending_articles_date\
                     left join tags on tags.id =  article_tags.tag_id \
                     where articles.is_active=1 AND articles.is_draft = 0" +
          weeklyTrendingQuery +
          monthlyTrendingQuery +
          quarterlyTrendingQuery +
          tagQuery +
          authorNameQuery,
        params
      ),
    ]);

    return {
      data: data.length === 0 ? "article not found" : data,
      total: total[0] ? total[0][0].count : 0,
    };
  }

  static async getArticleById(article_id) {
    let params = {
      article_id,
    };

    let data = await Database.query()
      .select(
        Database.rawQuery(
          "articles.title, \
             users.name as author, \
            articles.content, \
           json_arrayagg(json_object('image_link',`articles_images`.`image_link`,'id',`articles_images`.`id`)) as image_link, \
           articles.likes_count,json_arrayagg(json_object('name',`tags`.`name`,'id',`tags`.`id`)) as tags,articles.reading_time"
        )
      )
      .from("articles")
      .join("users", "users.uuid", "=", "articles.author_id")
      .leftJoin("tags", " tags.article_id", "=", "articles.id")
      .leftJoin("tags", "tags.id", "=", "tags.tag_id")
      .joinRaw(
        Database.rawQuery(
          "left join articles_images on articles_images.article_id = articles.id"
        )
      )
      .whereRaw(
        Database.rawQuery(
          "articles.is_active = 1 AND articles.is_draft = 0 AND  articles.id = :article_id ",
          params
        )
      )
      .groupBy("articles.id")
      .then((data) => {
        return data.map((article) => {
          // console.log(JSON.parse(article.image_link));

          let newImages: object[] = [];
          let uniqueImageIds: number[] = [];
          let oldImages = JSON.parse(article.image_link);

          oldImages.forEach((tag) => {
            const tagId: number = tag.id;
            oldImages.indexOf(tag) == 0 &&
              uniqueImageIds.push(tagId) &&
              newImages.push(tag);

            if (!uniqueImageIds.includes(tagId)) {
              uniqueImageIds.push(tagId);
              newImages.push(tag);
            }
          });
          article.image_link = newImages;

          let newTags: object[] = [];
          let uniqueTagIds: number[] = [];
          let oldTags = JSON.parse(article.tags);

          oldTags.forEach((tag) => {
            const tagId: number = tag.id;
            oldTags.indexOf(tag) == 0 &&
              uniqueTagIds.push(tagId) &&
              newTags.push(tag);

            if (!uniqueTagIds.includes(tagId)) {
              uniqueTagIds.push(tagId);
              newTags.push(tag);
            }
          });
          article.tags = newTags;
          return article;
        });
      });

    return {
      data: data[0] ? data[0] : "article not found",
    };
  }

  static async updateArticle(
    article_id,
    title,
    tags,
    images,
    content,
    author_uuid
  ) {
    let article = await Article.find(article_id);
    if (!article) {
      return { success: false, message: " article not found " };
    }

    if (author_uuid !== article.author_id) {
      return { success: false, message: "you do not have this permission" };
    }

    if (images) {
      await ArticlesImage.query().where("article_id", article_id).delete();

      images.map((data) => {
        ArticlesImage.create({
          article_id: article_id,
          image_link: data.image_link,
          is_cover: data.is_cover,
        });
      });
    }

    if (tags) {
      let old_tags = await Database.query()
        .select("tag_id")
        .from("article_tags")
        .where("article_id", article_id);

      if (old_tags.length === 0) {
        return { success: false, message: "tags with this article not found" };
      }

      // TODO: here we need to check if we are updating todays articles with date and same for the weekly count too
      old_tags.map(async (tagId) => {
        await Database.rawQuery(
          'update tags set \
           tags.today_used_in_articles = IF(tags.today_date =  DATE_FORMAT(CURDATE(),"%Y-%m-%d") ,tags.today_used_in_articles - 1,tags.today_used_in_articles), \
           tags.weekly_used_in_articles = IF(DATE_ADD(tags.weekly_date, INTERVAL 7 DAY) >= DATE_FORMAT(CURDATE(),"%Y-%m-%d"),\
           tags.weekly_used_in_articles - 1,tags.weekly_used_in_articles), \
           tags.used_in_articles = tags.used_in_articles - 1\
           where tags.id = :tagId',
          { tagId: tagId.tag_id }
        );
      });

      await Database.query()
        .delete()
        .from("article_tags")
        .where("article_id", article_id);

      tags.map(async (tagId) => {
        await ArticleTag.create({
          tag_id: tagId,
          article_id: article_id,
        });
      });

      tags.map(async (tagId) => {
        //  TODO: run cron job to reset weekly and today columns
        await Database.rawQuery(
          'update tags set \
             tags.today_used_in_articles = IF(tags.today_date =  DATE_FORMAT(CURDATE(),"%Y-%m-%d") ,tags.today_used_in_articles + 1,tags.today_used_in_articles),\
             tags.weekly_used_in_articles = IF(DATE_ADD(tags.weekly_date, INTERVAL 7 DAY) >= DATE_FORMAT(CURDATE(),"%Y-%m-%d"),\
             tags.weekly_used_in_articles + 1,tags.weekly_used_in_articles), tags.used_in_articles = tags.used_in_articles + 1  \
             where tags.id = :tagId',
          { tagId }
        );
      });
    }

    if (title) article.title = title;
    if (content) article.content = content;

    article.save();
  }

  static async deleteArticle(article_id, author_uuid) {
    let article = await Article.find(article_id);

    if (!article) {
      return { success: false, message: " article not found " };
    }

    if (author_uuid !== article.author_id) {
      return { success: false, message: "you do not have this permission" };
    }

    let old_tags = await Database.query()
      .select("tag_id")
      .from("article_tags")
      .where("article_id", article_id);

    if (old_tags.length === 0) {
      return { success: false, message: "tags with this article not found" };
    }

    old_tags.map(async (tagId) => {
      await Database.rawQuery(
        'update tags set \
          tags.today_used_in_articles = IF(tags.today_date =  DATE_FORMAT(CURDATE(),"%Y-%m-%d") ,tags.today_used_in_articles - 1,tags.today_used_in_articles), \
          tags.weekly_used_in_articles = IF(DATE_ADD(tags.weekly_date, INTERVAL 7 DAY) >= DATE_FORMAT(CURDATE(),"%Y-%m-%d"),\
          tags.weekly_used_in_articles - 1,tags.weekly_used_in_articles) ,\
          tags.used_in_articles = tags.used_in_articles - 1 \
          where tags.id = :tagId',
        { tagId: tagId.tag_id }
      );
    });
    await ArticlesImage.query().delete().where("article_id", article_id);
    await Database.query()
      .delete()
      .from("article_tags")
      .where("article_id", article_id);

    // TODO: if any of querie failed run rollback command

    await Database.rawQuery(
      "delete from  bookmarks where bookmarks.article_id = :article_id ",
      { article_id }
    );

    article.is_active = false;
    article.save();
  }

  static async addViews(article_id: number) {
    let article = await Article.find(article_id);

    // TODO: run cron job like if current date is less than that date then add seven and thirty in that date and make views to zero
    // TODO: check for ip address of a user so that one user cannot view multiple time or account id something like that
    if (!article) {
      return { success: false, message: "article not found" };
    }

    let article_views = await ArticleView.findBy("article_id", article_id);
    let current_date = moment(new Date());

    let seven_days_date = moment(article_views?.date_for_seven_days);
    let thirty_days_date = moment(article_views?.date_for_thirty_days);

    let seven_days_diff = seven_days_date.diff(current_date, "days");
    let thirty_days_diff = thirty_days_date.diff(current_date, "days");

    if (seven_days_diff >= 0) {
      await Database.rawQuery(
        "update article_views	 set article_views.seven_days_views =article_views.seven_days_views  + 1 \
      where article_views.article_id = :article_id  ",
        { article_id }
      );
    }

    if (thirty_days_diff >= 0) {
      await Database.rawQuery(
        "update article_views	 set article_views.thirty_days_views = article_views.thirty_days_views + 1 \
      where article_views.article_id = :article_id  ",
        { article_id }
      );
    }

    await Database.rawQuery(
      "update article_views	 set article_views.overall_views =article_views.overall_views + 1 \
    where article_views.article_id = :article_id  ",
      { article_id }
    );

    return true;
  }
}
export default ArticleService;
