import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class ArticleValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({});

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {};

  static createArticle = {
    schema: schema.create({
      title: schema.string(),
      images: schema.array.optional().anyMembers(),
      tags: schema.array().anyMembers(),
      content:schema.string.optional()
    }),
    messages: BaseValidator.messages,
  };

  static updateArticle = {
    schema: schema.create({
      article_id: schema.number(),
      title: schema.string.optional(),
      images: schema.array.optional().anyMembers(),   
      tags: schema.array.optional().anyMembers(),
      content:schema.string.optional()
    }),
    messages: BaseValidator.messages,
  };

  static getArticleById = {
    schema: schema.create({
      article_id: schema.number(),
    }),
    messages: BaseValidator.messages,
  };
}
