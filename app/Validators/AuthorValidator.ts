import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "./BaseValidator";

export default class AuthorValidator {
  constructor (protected ctx: HttpContextContract) {
  }

 static getAuthorDetails={
	 schema:schema.create({
		author_uuid:schema.string()
	 }),
	 message: BaseValidator.messages
 }
}
