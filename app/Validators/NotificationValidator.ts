import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class NotificationValidator {
  constructor(protected ctx: HttpContextContract) {}

 
  public schema = schema.create({});
  
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
