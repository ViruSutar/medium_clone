"use strict";

import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import ArticlesImage from "App/Models/ArticlesImage";
import ArticleTag from "App/Models/ArticleTag";
import Tag from "App/Models/Tag";
import UserNotification from "App/Models/UserNotification";
import Tags from "Database/migrations/110_tags";

export default class DraftService {
  // TODO:create articles tags if at
//   TODO: make auto save feature like hash node
  static async createDraft(title, content, images, author_id, tags) {
    let article = await Article.create({
      title,
      content,
      author_id: author_id,
      reading_time: 2,
      is_draft:true
    });
    let articleId = article.id;

    ArticleTag;
    tags &&
      tags.map((tagId) => {
        ArticleTag.create({
          tag_id: tagId,
          article_id: articleId,
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
    // only author should see this list
  static async listDrafts(
    limit,
    offset,
    sort_by_date,
  ) {
    let limitQuery = "";
    let offsetQuery = "";
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

    if (sort_by_date != null && sort_by_date != "") {
      orderById = "";
      orderByDate = " order by articles.created_at " + sort_by_date;
    }


  
    let [data, total] = await Promise.all([
      Database.rawQuery(
        'select users.name as author_name, articles.title,articles.id as article_id, \
                    articles.likes_count, DATE_FORMAT(articles.created_at,"%d/%m/%Y") as Date,\
                    articles_images.image_link as image,tags.name as tag_name\
                     from articles \
                     join users on users.id=articles.author_id \
                     join articles_images on articles_images.article_id = articles.id and is_cover = 1\
                     left join  article_tags on  article_tags.article_id = articles.id\
                     left join tags on tags.id =  article_tags.tag_id  where articles.is_active = 1 \
                      ' +
          " group by articles.id " +
          orderById +
          orderByDate +
          limitQuery +
          offsetQuery,
        params
      ),
      Database.rawQuery(
        "select count(distinct articles.id) as count \
                     from articles \
                     left join users on users.id=articles.author_id \
                     join articles_images on articles_images.article_id = articles.id and is_cover = 1 \
                     left join  article_tags on  article_tags.article_id = articles.id\
                     left join tags on tags.id =  article_tags.tag_id \
                     where articles.is_active=1"
          ,
        params
      ),
    ]);
    return {
      data: data[0],
      total: total[0] ? total[0][0].count : 0,
    };
  }

  static async getDraftDetails(article_id) {
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
           articles.likes_count,json_arrayagg(json_object('name',`tags`.`name`,'id',`tags`.`id`)) as tags"
        )
      )
      .from("articles")
      .leftJoin("users", "users.id", "=", "articles.author_id")
      .leftJoin("article_tags", " article_tags.article_id", "=", "articles.id")
      .leftJoin("tags", "tags.id", "=", "article_tags.tag_id")
      .joinRaw(
        Database.rawQuery(
          "left join articles_images on articles_images.article_id = articles.id"
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

  static async updateDraft(article_id, title, article_tags, images, content) {
    let article = await Article.find(article_id);

    if (!article) {
      return { success: false, message: " article not found " };
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

    if (article_tags) {
      await ArticleTag.query().where({ article_id }).delete();

      article_tags.map(async (data) => {
        await ArticleTag.create({
          tag_id: data,
          article_id: article?.id,
        });
      });
    }

    if (title) article.title = title;
    if (content) article.content = content;

    article.save();
  }

  static async deleteDraft(article_id) {
    let article = await Article.find(article_id);

    if (!article) {
      return { success: false, message: " article not found " };
    }

    article.is_active = false;
    article.save();
  }
}

