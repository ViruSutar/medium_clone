"use strict";

import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import ArticlesImage from "App/Models/ArticlesImage";
import ArticleTag from "App/Models/ArticleTag";
import Tag from "App/Models/Tag";
import Tags from "Database/migrations/110_tags";

export default class DraftService {
  //   TODO: make auto save feature like hash node
  // TODO: on hashnode it saves the page when u stop typing keep that in mind
  static async createDraft(title, content, images, author_id, tags) {
    let article = await Article.create({
      title,
      content,
      author_id: author_id,
      reading_time: 2,
      is_draft: true,
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
  static async listDrafts(limit, offset, sort_by_date, user_uuid) {
    let limitQuery = "";
    let offsetQuery = "";
    let orderById = "Order By articles.id  desc ";
    let orderByDate = " ";
    let params = {
      user_uuid,
    };

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
        'select users.name as author_name, articles.title,articles.id as article_id,SUBSTRING(articles.content,1,200) as content, \
                    articles.likes_count, DATE_FORMAT(articles.created_at,"%d/%m/%Y") as Date,\
                    articles_images.image_link as image,tags.name as tag_name\
                     from articles \
                     join users on users.uuid=articles.author_id \
                     left join articles_images on articles_images.article_id = articles.id and is_cover = 1\
                     left join  article_tags on  article_tags.article_id = articles.id\
                     left join tags on tags.id =  article_tags.tag_id  where articles.is_active = 1 AND articles.is_draft = true \
                      AND articles.author_id = :user_uuid' +
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
                     join users on users.uuid=articles.author_id \
                     left join articles_images on articles_images.article_id = articles.id and is_cover = 1 \
                     left join  article_tags on  article_tags.article_id = articles.id\
                     left join tags on tags.id =  article_tags.tag_id \
                     where articles.is_active=1  AND articles.is_draft = true AND articles.author_id = :user_uuid ",
        params
      ),
    ]);
    return {
      data: data[0].length == 0 ? "You do not have any drafts yet" : data[0],
      total: total[0] ? total[0][0].count : 0,
    };
  }

  static async getDraftDetails(article_id, user_uuid) {
    let params = {
      article_id,
      user_uuid,
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
      .leftJoin("users", "users.uuid", "=", "articles.author_id")
      .leftJoin("article_tags", " article_tags.article_id", "=", "articles.id")
      .leftJoin("tags", "tags.id", "=", "article_tags.tag_id")
      .joinRaw(
        Database.rawQuery(
          "left join articles_images on articles_images.article_id = articles.id"
        )
      )
      .whereRaw(
        Database.rawQuery(
          "articles.is_active = 1 AND  articles.id = :article_id AND articles.is_draft = true AND articles.author_id = :user_uuid ",
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
      data: data[0] ? data[0] : "draft not found",
    };
  }

  static async updateDraft(
    draft_id,
    title,
    article_tags,
    images,
    content,
    user_uuid
  ) {
    let article = await Article.find(draft_id);

    if (!article) {
      return { success: false, message: " draft not found " };
    }

    if (article.author_id !== user_uuid) {
      return { success: false, message: "You do not have this permission" };
    }

    if (article.is_draft != true) {
      return { success: false, message: "you cannot update this draft" };
    }

    if (images) {
      await ArticlesImage.query().where("article_id", draft_id).delete();

      images.map((data) => {
        ArticlesImage.create({
          article_id: draft_id,
          image_link: data.image_link,
          is_cover: data.is_cover,
        });
      });
    }

    if (article_tags) {
      await ArticleTag.query().where({ draft_id }).delete();

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

  static async deleteDraft(article_id, user_uuid) {
    let article = await Article.find(article_id);

    if (!article) {
      return { success: false, message: "draft not found" };
    }

    if (article.author_id !== user_uuid) {
      return { success: false, message: "You do not have this permission" };
    }

    if (article.is_draft != true) {
      return { success: false, message: "This is not draft" };
    }
    
    await ArticleTag.query().delete().where('article_id',article_id)
    await ArticlesImage.query().delete().where('article_id',article_id)
    article.delete()
    article.save()
  }

  static async publishArticle(draft_id,user_uuid) {
    let article = await Article.find(draft_id);
    let tags = await ArticleTag.findBy("article_id", draft_id);

    if (!article) {
      return { success: false, message: "draft not found" };
    }

    if (article.author_id !== user_uuid) {
      return { success: false, message: "You do not have this permission" };
    }

    if (article?.title === null || article?.content === null || tags === null) {
      return { success: false, message: "fields are empty" };
    }

    article.is_draft = false;
    article.save();

    return { success: true, articleId: article.id };
  }
}
