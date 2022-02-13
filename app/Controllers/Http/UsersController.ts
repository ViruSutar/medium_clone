// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/http-server/build/standalone";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import UserService from "App/Services/UserService";
import UserValidator from "App/Validators/UserValidator";

export default class UsersController {
 
  public async login({ request, response, session, auth }) {
    try {
      let { email, password } = request.all();

      await request.validate({
        schema: schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string(),
        }),
      });
      await auth.attempt(email, password);

      let user = auth.user;

      let role = await Database.query()
        .select(Database.rawQuery("users.role,users.id"))
        .from("users")
        .where("users.id", user.id);
      await session.put("auth", role[0]);

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async logOut({ request, response, auth, session }) {
    try {
      session.clear();
      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async getUserById({ request, response, session }) {
    try {
      // TODO: articles written by this user and subscription model too
      let { user_id } = request.all();

      let data = await Database.query()
        .select(Database.rawQuery("users.name,users.email"))
        .from("users")
        .where("users.id", user_id);
      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async listUsers({ request, response }: HttpContext) {
    try {
      let { role_name, limit, offset } = request.all();
      let params = {};
      let roleNameQuery = "";
      let limitQuery;

      if (role_name) {
        roleNameQuery = " and users.role = :role_name ";
        params["role_name"] = role_name;
      }

      if (limit) {
        limitQuery = parseInt(limit);
      } else {
        limitQuery = 10000000000;
      }

      if (!offset) {
        offset = 0;
      }

      let data = await Database.query()
        .select(
          Database.rawQuery("users.name,users.email,users.followers,users.role")
        )
        .from("users")
        .whereRaw(Database.rawQuery("users.is_active" + roleNameQuery, params))
        .limit(limitQuery)
        .offset(offset);
      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }
  public async getUserNotificationById({ request, response }: HttpContext) {
    try {
      let { user_id } = request.all();

      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
        }),
        messages: {
          "req.user_id": "user_id is required",
        },
      });
      let data = await Database.query()
        .select(
          Database.rawQuery(
            'user_notifications.id,user_notifications.message,date_format(user_notifications.created_at,"%D %M %Y") as Date'
          )
        )
        .from("user_notifications")
        .where("user_notifications.user_id", user_id)
        .orderBy("user_notifications.created_at", "desc");

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }
}
