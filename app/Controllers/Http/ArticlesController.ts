// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import { schema } from "@ioc:Adonis/Core/Validator";
import ArticleSubCategory from "App/Models/ArticleSubCategory";
import ArticleValidator from "App/Validators/ArticleValidator";
import ArticleService from "App/Services/ArticleService";
import DraftService from "App/Services/DraftService";
import DraftValidator from "App/Validators/DraftValidator";
import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";

export default class ArticlesController {
  public async createArticle({ request, response }) {
    let { title, content, images, tags } = request.all();
    let author_uuid = request.user.user_uuid;

    await request.validate(ArticleValidator.createArticle);

    let article = await ArticleService.createArticle(
      title,
      content,
      images,
      author_uuid,
      tags
    );
     
    if(article.success=== false){
      return response.status(article.status_code).send({success:false,message:article.message})
    }
    return response.send({ success: true, articleId: article.articleId });
  }

  public async listArticles({ request, response }) {
    let {
      limit,
      offset,
      article_tag,
      sort_by_date,
      author_name,
      weekly_trending,
      monthly_trending,
      quarterly_trending,
    } = request.all();

    const token = request.header("Authorization");

    if (token) {
      const decode = jwt.verify(token, Env.get("SECRET_KEY"));
      request["user"] = decode;
    }

    let user_uuid;
    if (request.user !== undefined) {
      user_uuid = request.user.user_uuid;
    } else {
      user_uuid = null;
    }

    let articles = await ArticleService.listArticles(
      limit,
      offset,
      article_tag,
      sort_by_date,
      author_name,
      user_uuid,
      weekly_trending,
      monthly_trending,
      quarterly_trending
    );

    return response.send({
      success: true,
      Data: articles.data,
      count: articles.total,
    });
  }

  public async getArticleById({ request, response }) {
    let { article_id } = request.all();

    await request.validate(ArticleValidator.getArticleById);
    let article = await ArticleService.getArticleById(article_id);

    return response.send({
      success: true,
      Data: article.data,
    });
  }

  public async updateArticle({ request, response }) {
    let { article_id, title, tags, images, content } = request.all();
    let author_uuid = request.user.user_uuid;

    await request.validate(ArticleValidator.updateArticle);
    let article = await ArticleService.updateArticle(
      article_id,
      title,
      tags,
      images,
      content,
      author_uuid
    );
    if (article?.success === false) {
      return response
        .status(404)
        .send({ success: false, message: article.message });
    }
    return response.send({ success: true });
  }

  public async deleteArticle({ request, response }) {
    let { article_id } = request.all();
    let author_uuid = request.user.user_uuid;

    await request.validate(ArticleValidator.deleteArticle);

    let article = await ArticleService.deleteArticle(article_id, author_uuid);

    if (article?.success === false) {
      return response
        .status(404)
        .send({ success: false, message: article.message });
    }

    return response.status(200).send({ success: true });
  }

  ////**** Drafts ****////

  public async createDraft({ request, response }) {
    let { title, content, images, tags } = request.all();
    let user_uuid = request.user.user_uuid;
    await request.validate(DraftValidator.createDraft);

    let article = await DraftService.createDraft(
      title,
      content,
      images,
      user_uuid,
      tags
    );
    return response
      .status(200)
      .send({ success: true, draftId: article.articleId });
  }

  public async listDrafts({ request, response }) {
    let { limit, offset, sort_by_date } = request.all();
    let user_uuid = request.user.user_uuid;

    // only author should see this list
    let articles = await DraftService.listDrafts(
      limit,
      offset,
      sort_by_date,
      user_uuid
    );

    return response.status(200).send({
      success: true,
      Data: articles.data,
      count: articles.total,
    });
  }

  public async getDraftDetails({ request, response }) {
    let { draft_id } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(DraftValidator.getDraftById);
    let draft = await DraftService.getDraftDetails(draft_id, user_uuid);

    return response.status(200).send({
      success: true,
      Data: draft,
    });
  }

  public async updateDraft({ request, response }) {
    let { draft_id, title, tags, images, content } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(DraftValidator.updateDraft);

    let draft = await DraftService.updateDraft(
      draft_id,
      title,
      tags,
      images,
      content,
      user_uuid
    );

    if (draft?.success === false) {
      return response
        .status(404)
        .send({ success: false, message: draft.message });
    }

    return response.status(200).send({
      success: true,
    });
  }

  public async deleteDraft({ request, response }) {
    let { draft_id } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(DraftValidator.getDraftById);
    let draft = await DraftService.deleteDraft(draft_id, user_uuid);

    if (draft?.success === false) {
      return response
        .status(404)
        .send({ success: false, message: draft.message });
    }

    return response.status(200).send({
      success: true,
    });
  }

  public async publishArticle({ request, response }) {
    let { draft_id } = request.all();
    let user_uuid = request.user.user_uuid;

    let draft = await DraftService.publishArticle(draft_id, user_uuid);

    if (draft?.success === false) {
      return response
        .status(404)
        .send({ success: false, message: draft.message });
    }

    return response.status(200).send({
      success: true,
      articleId: draft.articleId,
    });
  }

  public async listSubCategories({ request, response }) {
    try {
      let { limit, offset } = request.all();
      let limitQuery = "";
      let offsetQuery = "";
      let params = {};

      if (limit != null && limit != "") {
        limitQuery = " limit :limit";
        params["limit"] = parseInt(limit);
      }

      if (limit != null && limit != "" && offset != null && offset != "") {
        offsetQuery = " offset :offset";
        params["offset"] = parseInt(offset);
      }

      let [data, total] = await Promise.all([
        Database.rawQuery(
          "select article_sub_categories.sub_categories, article_sub_categories.id \
                         from  article_sub_categories \
                         where article_sub_categories.is_active = 1" +
            limitQuery +
            offsetQuery,
          params
        ),
        Database.rawQuery(
          "select count (distinct article_sub_categories.id) \
                         from  article_sub_categories \
                         where article_sub_categories.is_active = 1"
        ),
      ]);

      return response.send({
        success: true,
        Data: data[0],
        total: total[0] ? total[0][0].count : 0,
      });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async createSubCategories({ request, response }) {
    try {
      let { sub_categories } = request.all();

      await request.validate({
        schema: schema.create({
          sub_categories: schema.string(),
        }),
      });

      await ArticleSubCategory.create({
        sub_categories,
      });

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async updateSubcategories({ request, response }) {
    try {
      let { sub_category_id, sub_category } = request.all();

      await request.validate({
        schema: schema.create({
          sub_category: schema.string.optional(),
          sub_category_id: schema.number(),
        }),
      });

      let subcategory = await ArticleSubCategory.findByOrFail(
        "id",
        sub_category_id
      );

      if (subcategory) subcategory.sub_categories = sub_category;

      subcategory.save();

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async deleteSubcategories({ request, response }) {
    try {
      let { sub_category_id } = request.all();

      await ArticleSubCategory.query()
        .where("id", sub_category_id)
        .update("is_active", 0);

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async listTopAuthors({ request, response }) {
    try {
      let data = await Database.query()
        .select(
          Database.rawQuery(
            "users.name ,users.id ,sum(articles.likes_count) as  likes_count "
          )
        )
        .from("articles")
        .join("users", "users.id", "=", "articles.user_id")
        .groupBy("users.id")
        .orderBy("likes_count", "desc")
        .limit(5);

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }
}
