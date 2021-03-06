import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class CommentValidator {
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

  static writeComment = {
    schema: schema.create({
      article_id: schema.number(),
      comment: schema.string(),
    }),
    messages: BaseValidator.messages
  };

  static editComment={
	  schema:schema.create({
		comment_id:schema.number(),
		comment:schema.string.optional()
	  }),
	  messages: BaseValidator.messages,
  }

  static listCommentsByArticleId ={
	  schema:schema.create({
		  article_id:schema.number(),
		  limit:schema.number.optional(),
		  offset:schema.number.optional()
	  }),
	  messages: BaseValidator.messages
  }

  static replyToComment = {
	  schema:schema.create({
		comment_id:schema.number(), 
		reply:schema.string(), 
		user_uuid:schema.string()
	  }),
	  messages: BaseValidator.messages
  }
}
