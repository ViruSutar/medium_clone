// // import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserService from "App/Services/UserService";
import UserValidator from "App/Validators/UserValidator";

export default class UsersController {
  public async updateUser({ request, response }) {
    let {
      name,
      cover_pic,
      profile_pic,
      email,
      twitter_link,
      instagram_link,
      linkedIn_link,
      personal_website_link,
      user_bio,
    } = request.all();

    let user_uuid = request.user.user_uuid;

    await request.validate(UserValidator.updateUser);
    let user = await UserService.updateUser(
      user_uuid,
      name,
      cover_pic,
      profile_pic,
      email,
      twitter_link,
      instagram_link,
      linkedIn_link,
      personal_website_link,
      user_bio
    );

    if (user.success === false) {
      return response
        .status(user.status_code)
        .send({ success: false, message: user.message });
    }

    return response.send({ success: true, message: user.message });
  }

  public async PasswordReset({ request, response }) {
    let { password, confirm_password ,new_password} = request.all();

    let user_uuid = request.user.user_uuid;

    await request.validate(UserValidator.PasswordReset);

    let user = await UserService.PasswordReset(
      user_uuid,
      password,
      new_password,
      confirm_password
    );

    if (user.success === false) {
      return response
        .status(user.status_code)
        .send({ success: false, message: user.message });
    }

    return response.send({ success: true, message: user.message });
  }

  public async deleteUser({ request, response }) {
    let user_uuid = request.user.user_uuid;

    let user = await UserService.deleteUser(user_uuid);

    if (user?.success === false) {
      return response
        .status(user.status_code)
        .send({ success: false, message: user.message });
    }

    return response.send({ success: true, message: user?.message });
  }

//   public async forgotPassword({ request, response }) {}
}
