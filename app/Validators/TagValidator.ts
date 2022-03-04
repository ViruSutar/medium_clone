import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class TagValidator {
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

  static createTag = {
    schema: schema.create({
      tag_name: schema.string({}, [rules.maxLength(30)]),
      image_link: schema.string.optional(),
      description: schema.string(),
    }),
    message: BaseValidator.messages,
  };

  static searchTag = {
    schema: schema.create({
      tag_name: schema.string(),
    }),
    message: BaseValidator.messages,
  };

  static updateTag = {
    schema: schema.create({
      tag_name: schema.string({}, [rules.maxLength(30)]),
      tag_id: schema.number(),
      status: schema
        .array()
        .members(schema.enum(["Approved", "Pending", "Rejected"])),
    }),
    message: BaseValidator.messages,
  };

  static rejectTag={
    schema:schema.create({
      tag_id:schema.number(),
      rejection_note:schema.string()
    }),
    message: BaseValidator.messages,
  }
}
