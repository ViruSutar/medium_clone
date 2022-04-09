import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class NotificationValidator {
  constructor(protected ctx: HttpContextContract) {}

 
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
  static createNotification = {
    schema: schema.create({
      user_uuid:schema.string(),
      type:schema.array().members(schema.enum(['mentions','likes','comments','tags','follwers','article'])),
      notification:schema.string(),
    }),
    message: BaseValidator.messages,
  };

  static deleteNotification = {
    schema: schema.create({
      notification_id:schema.number(),
    }),
    message: BaseValidator.messages, 
  };
}
