import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";
import Hash from "@ioc:Adonis/Core/Hash";

export default class AuthService {
  static async RegisterUser(name, email, password) {
    let user = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      { user_uuid: user.uuid, email },
      Env.get("SECRET_KEY"),
      {
        expiresIn: "2h",
      }
    );
    return { success: true, UserId: user.id, token };
  }

  static async login(email, password) {
    let user = await User.findBy("email", email);

    if (!user) {
      return {
        success: false,
        status_code:401,
        message: "No account with this id exist please create new account",
      };
    }

    if (!(await Hash.verify(user.password, password))) {
      return { success: false,status_code:400, message: "email or password incorrect" };
    }

    const token = jwt.sign(
      { user_uuid: user.uuid, email },
      Env.get("SECRET_KEY"),
      {
        expiresIn: "2h",
      }
    );

    return {success:true,token}
  }
}
