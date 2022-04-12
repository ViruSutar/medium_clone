import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class FollowerValidator {
  constructor (protected ctx: HttpContextContract) {
  }

 static listFollowers={
	 schema:schema.create({
      user_uuid:schema.string(),
	  limit:schema.string.optional(),
	  offet:schema.string.optional()
	 }),
	 messages: BaseValidator.messages
 }
}
