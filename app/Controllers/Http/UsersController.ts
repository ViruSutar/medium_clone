// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/http-server/build/standalone";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import Database from "@ioc:Adonis/Lucid/Database";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Bookmark from "App/Models/Bookmark";
import User from "App/Models/User";

export default class UsersController {
  public async createUser({ request, response }: HttpContext) {
    try {
      let { name, email, password } = request.all();

      await request.validate({
        schema: schema.create({
          name: schema.string(),
          email: schema.string({}, [rules.email()]),
          password: schema.string(),
        }),
      });

      let user = await User.create({
        name,
        email,
        password,
      });

      return response.send({ success: true, UserId: user.id });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

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
      let access= session.get('auth')
       
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

  public async addBookMark({ request, response }: HttpContext) {
    try {
      let { user_id, article_id, bookmark_type } = request.all();

      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          article_id: schema.number(),
          bookmark_type: schema.string.optional(),
        }),
      });
      await Bookmark.create({
        user_id,
        bookmark_id: article_id,
        bookmark_type,
      });

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async listBookMarksByUserId({ request, response }: HttpContext) {
    try {
      let { user_id, bookmark_type } = request.all();

      let bookMarkTypeQuery = "";
      let params = { user_id };

      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          bookmark_type: schema.string.optional(),
        }),
      });

      if (bookmark_type) {
        bookMarkTypeQuery = " AND bookmarks.bookmark_type = :bookmark_type ";
        params["bookmark_type"] = bookmark_type;
      }

      let data = await Database.query()
        .select(
          Database.rawQuery(
            "bookmarks.id as bookmark_id,users.name,articles.title,articles.content,bookmarks.bookmark_type"
          )
        )
        .from("bookmarks")
        .leftJoin("users", "users.id", "=", "bookmarks.user_id")
        .leftJoin("articles", "articles.id", "=", "bookmarks.bookmark_id")
        .whereRaw(
          Database.rawQuery(
            "bookmarks.user_id = :user_id " + bookMarkTypeQuery,
            params
          )
        );

      return response.send({ success: true, Data: data });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async deleteBookMark({ request, response }: HttpContext) {
    try {
      let { user_id, bookmark_id } = request.all();

      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          bookmark_id: schema.number(),
        }),
      });

      await Bookmark.query()
        .where("user_id", user_id)
        .where("id", bookmark_id)
        .delete();

      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }
}
