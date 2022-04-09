import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class TagValidator {
  constructor(protected ctx: HttpContextContract) {}
  
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
