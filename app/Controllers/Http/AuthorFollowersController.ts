// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/http-server/build/standalone";
import Database from "@ioc:Adonis/Lucid/Database";
import AuthorFollower from "App/Models/AuthorFollower";
import User from "App/Models/User";

export default class AuthorFollowersController {
  public async follow({ request, response }: HttpContext) {
    try {
      let { follower_id, author_id } = request.all();

      await AuthorFollower.create({
        follower_id,
        author_id,
      });

      await Database.rawQuery(
        "update users set users.followers = users.followers + 1 where users.id = ? ",
        author_id
      );
      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }

  public async unfollow({ request, response }: HttpContext) {
    try {
      let { unfollower_id, unfollowee_id } = request.all();
 
      await AuthorFollower.query().where('follower_id',unfollower_id).where('author_id',unfollowee_id).delete()


      await Database.rawQuery(
        "update users set users.followers = users.followers - 1 where users.id = ? ",
        unfollowee_id
      )
      return response.send({ success: true });
    } catch (error) {
      console.log(error);
      return response.send({ success: false, message: error });
    }
  }
}
