import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";
import Hash from "@ioc:Adonis/Core/Hash";
import Database from "@ioc:Adonis/Lucid/Database";

export default class UserService {
  // TODO:check for unique email
  // TODO: check chars limit for user bio and unique
  static async updateUser(
    user_uuid: string,
    name: string,
    cover_pic: string,
    profile_pic: string,
    email: string,
    twitter_link: string,
    instagram_link: string,
    linkedIn_link: string,
    personal_website_link: string,
    user_bio: string
  ) {
    let user = await User.findBy("uuid", user_uuid);

    if (!user) {
      return { success: false, status_code: 404, message: "User not found" };
    }

    let find_user = await User.query()
    .where("uuid", user_uuid)
    .where("is_active", true);

  if (find_user.length !== 0) {
    return { success: false, status_code: 404, message: "User not found" };
  }

    if (name) user.name = name;
    if (cover_pic) user.cover_pic = cover_pic;
    if (profile_pic) user.profile_pic = profile_pic;
    if (email) {
      let user_email = await User.query()
        .where("users.email", email)
        .whereNot("uuid", user_uuid);
      if (user_email.length !== 0) {
        return {
          success: false,
          status_code: 400,
          message: "Email already exist",
        };
      }

      user.email = email;
    }
    if (twitter_link) user.twitter_link = twitter_link;
    if (instagram_link) user.instagram_link = instagram_link;
    if (linkedIn_link) user.linkedin_link = linkedIn_link;
    if (personal_website_link)
      user.personal_website_link = personal_website_link;
    if (user_bio) user.user_bio = user_bio;
    user.save();

    return {
      success: true,
      message: "Profile updated successfully",
    };
  }

  static async PasswordReset(
    user_uuid: string,
    password: string,
    new_password: string,
    confirm_password: string
  ) {
    let regularExpression =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
    let result = regularExpression.test(new_password);

    let resetPassword = await User.findBy("uuid", user_uuid);
    if (!resetPassword) {
      return {
        success: false,
        status_code: 404,
        message: "User not found",
      };
    }

    let find_user = await User.query()
    .where("uuid", user_uuid)
    .where("is_active", true);

  if (find_user.length !== 0) {
    return { success: false, status_code: 404, message: "User not found" };
  }

    if (!(await Hash.verify(resetPassword.password, password))) {
      console.log(true);

      return {
        success: false,
        status_code: 400,
        message: "please enter correct password",
      };
    }

    if (new_password !== confirm_password) {
      return {
        success: false,
        status_code: 400,
        message: "new password and conform password dosenot match",
      };
    }

    if (result === false) {
      return {
        success: false,
        status_code: 400,
        message: "The password doesn't adhere to the required rules",
      };
    }
    resetPassword.password = new_password;
    await resetPassword.save();

    return {
      success: true,
      message: "Password changed successfully",
    };
  }

  static async deleteUser(user_uuid: string) {
    let user = await User.findBy("uuid", user_uuid);

    if (!user) {
      return { success: false, status_code: 404, message: "User not found" };
    }

    let find_user = await User.query()
      .where("uuid", user_uuid)
      .where("is_active", true);

    if (find_user.length !== 0) {
      return { success: false, status_code: 404, message: "User not found" };
    }

    // user.is_active = false;
    // user.save();
    return { success: true, message: "account deleted successfully" };
    // TODO: user should logout after this
  }

  static async forgotPassword(user_uuid: string) {}
}
