import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  static updateUser = {
    schema: schema.create({
      name: schema.string.optional(),
      cover_pic: schema.string.optional(),
      profile_pic: schema.string.optional(),
      email: schema.string({}, [rules.email()]),
      twitter_link: schema.string.optional(),
      instagram_link: schema.string.optional(),
      linkedIn_link: schema.string.optional(),
      personal_website_link: schema.string.optional(),
      user_bio: schema.string.optional({}, [rules.maxLength(140)]),
    }),
    message: BaseValidator.messages,
  };

  static PasswordReset = {
    schema: schema.create({
      password: schema.string({}, [
        rules.regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/
        ),
      ]),
      new_password: schema.string({}, [
        rules.regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/
        ),
      ]),
      confirm_password: schema.string({}, [
        rules.regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/
        ),
      ]),
    }),
    message: BaseValidator.messages,
  };
}
