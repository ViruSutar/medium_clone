import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class ArticleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({});

  public messages = {};

  static createArticle = {
    schema: schema.create({
      title: schema.string(),
      images: schema.array.optional().anyMembers(),
      tags: schema.array([rules.maxLength(5),rules.minLength(1)]).members(schema.number()),
      content: schema.string.optional(),
    }),
    messages: BaseValidator.messages,
  };

  static updateArticle = {
    schema: schema.create({
      article_id: schema.number(),
      title: schema.string.optional(),
      images: schema.array.optional().anyMembers(),
      tags: schema.array([rules.maxLength(5)]).members(schema.number()),
      content: schema.string.optional(),
    }),
    messages: BaseValidator.messages,
  };

  static getArticleById = {
    schema: schema.create({
      article_id: schema.number(),
    }),
    messages: BaseValidator.messages,
  };

  static deleteArticle = {
    schema:schema.create({
      article_id:schema.number()
    }),
    messages: BaseValidator.messages
  }
}
