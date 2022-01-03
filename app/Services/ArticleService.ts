"use strict";

import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import ArticlesImage from "App/Models/ArticlesImage";
import ArticleTag from "App/Models/ArticleTag";
import UserNotification from "App/Models/UserNotification";

class ArticleService {
  // TODO:create articles tags if at
  static async createArticle(title, content, images, user_id, article_tags) {
    let article = await Article.create({
      title,
      content,
      user_id,
      reading_time: 2,
    });

    let articleId = article.id;

    //feed data in user_notification_table
    // let user_ids = await Database.query()
    //   .select(
    //     Database.rawQuery(
    //       "author_followers.follower_id  as followers, \
    //         users.name as author"
    //     )
    //   )
    //   .from("author_followers")
    //   .leftJoin("users", "users.id", "=", "author_followers.author_id")
    //   .where("author_followers.author_id", user_id); //this user_id is author_id
    // user_ids &&
    //   user_ids.map(async (row) => {
    //     let user_id = row.followers;
    //     let author = row.author;
    //     await UserNotification.create({
    //       user_id,
    //       message: author + " has uploaded article on " + title,
    //     });
    //   });

    article_tags.map(async (data) => {
      var tag = await ArticleTag.create({
        tag: data,
        article_id: article.id,
      });
    });

    images &&
      images.map((data) => {
        ArticlesImage.create({
          article_id: articleId,
          image_link: data.image_link,
          is_cover: data.is_cover,
        });
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
    sort_by_likes,
    sort_by_date,
    author_name
  ) {
    let limitQuery = "";
    let offsetQuery = "";
    let tagQuery = "";
    let authorNameQuery = "";
    let orderByLikes = "";
    let orderById = "Order By articles.id  desc ";
    let orderByDate = " ";
    let params = {};

    if (limit != null && limit != "") {
      limitQuery = " limit :limit";
      params["limit"] = parseInt(limit);
    }

    if (limit != null && limit != "" && offset != null && offset != "") {
      offsetQuery = " offset :offset";
      params["offset"] = parseInt(offset);
    }

    if (article_tag) {
      console.log(true);
      tagQuery = " AND article_tags.tag = :article_tag  ";
      params["article_tag"] = article_tag;
    }

    if (sort_by_likes != null && sort_by_likes != "") {
      //use limit 5 to get top 5 trending articles
      //  TODO: this query  should run only once a day so the we can set todays top 5 articles
      orderById = "";
      orderByLikes = " order by articles.likes_count desc ";
    }

    if (sort_by_date != null && sort_by_date != "") {
      orderById = "";
      orderByDate = " order by articles.created_at " + sort_by_date;
    }

    if (sort_by_likes && sort_by_date) {
      return { message: "Select only one filter" };
    }

    if (author_name != null && author_name != "") {
      params["author_name"] = author_name;
      authorNameQuery = " AND users.name = :author_name ";
    }

    let [data, total] = await Promise.all([
      Database.rawQuery(
        'select users.name as author_name, articles.title,articles.id as article_id, \
                    articles.likes_count, DATE_FORMAT(articles.created_at,"%d/%m/%Y") as Date,\
                    articles_images.image_link as image, json_arrayagg(json_object("id",article_tags.id,"tag",article_tags.tag)) as tag \
                     from articles \
                     join article_tags on article_tags.article_id = articles.id \
                     join users on users.id=articles.user_id \
                     join articles_images on articles_images.article_id = articles.id and is_cover = 1\
                     where articles.is_active= 1 ' +
          tagQuery +
          authorNameQuery +
          "group by articles.id " +
          orderById +
          orderByLikes +
          orderByDate +
          limitQuery +
          offsetQuery,
        params
      ).then((data) => {
        return data[0].map((article) => {
          let newTags: object[] = [];
          let uniqueTagIds: number[] = [];
          let oldTags = JSON.parse(article.tag);

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
          article.tag = newTags;
          return article;
        });
      }),
      Database.rawQuery(
        "select count(distinct articles.id) as count \
                     from articles \
                     join article_tags on article_tags.article_id = articles.id \
                     left join users on users.id=articles.user_id \
                     join articles_images on articles_images.article_id = articles.id and is_cover = 1 \
                     where articles.is_active=1" +
          tagQuery +
          authorNameQuery,
        params
      ),
    ]);

    return {
      data: data,
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
           json_arrayagg(articles_images.image_link) as image_link, \
           json_arrayagg(json_object('id',article_tags.id,'tag',article_tags.tag)) as tag,articles.likes_count"
        )
      )
      .from("articles")
      .leftJoin("users", "users.id", "=", "articles.user_id")
      .join("article_tags","article_tags.article_id","=","articles.id")
      .joinRaw(
        Database.rawQuery(
          "join articles_images on articles_images.article_id = articles.id"
        )
      )
      .whereRaw(
        Database.rawQuery(
          "articles.is_active = 1 AND  articles.id = :article_id ",
          params
        )
      )
      .groupBy("articles.id")
      .then((data) => {
        return data.map((article) => {
          article.image_link=JSON.parse(article.image_link)
          let newTags: object[] = [];
          let uniqueTagIds: number[] = [];
          let oldTags = JSON.parse(article.tag);

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
          article.tag = newTags;
          return article;
        });
      })

    return {
      data: data[0] ? data[0] : "article not found",
    };
  }

  static async updateArticle(article_id, title, article_tags, images, content) {
    let article = await Article.findByOrFail("id", article_id);

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

    if (article_tags) {
      await ArticleTag.query().where({article_id: article_id}).delete();
     
      article_tags.map(async (data) => {
        await ArticleTag.create({
          tag: data,
          article_id: article.id,
        });
      });
    }

    if (title) article.title = title;
    if (content) article.content = content;

    article.save();
  }
}

export default ArticleService;
