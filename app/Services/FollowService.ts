import Database from "@ioc:Adonis/Lucid/Database";
import Follower from "App/Models/Follower";
import User from "App/Models/User";

export default class FollowService {
  static async follow(follower_uuid: string, followee_uuid: string) {
    let checkFollow = await Database.query()
      .select("followers.id")
      .from("followers")
      .where("follower_id", follower_uuid)
      .where("followee", followee_uuid);

    if (checkFollow.length !== 0) {
      return {
        success: false,
        status_code: 400,
        message: "You are aready following this author",
      };
    }

    await Follower.create({
      followee: followee_uuid,
      follower_id: follower_uuid,
    });

    await Database.rawQuery(
      "update users set users.follower_count = users.follower_count + 1 \
                             where users.uuid = :follower_uuid",
      { follower_uuid }
    );

    await Database.rawQuery(
      "update users set  users.followee_count = users.followee_count + 1 where users.uuid = :followee_uuid",
      { followee_uuid }
    );

    return { success: true };
  }

  static async unfollow(follower_uuid: string, followee_uuid: string) {

    let checkFollow = await Database.query()
      .select("followers.id")
      .from("followers")
      .where("follower_id", follower_uuid)
      .where("followee", followee_uuid);
 
      if (checkFollow.length === 0) {
        return {
          success: false,
          status_code: 400,
          message: "You are not following this author",
        };
      }

    await Follower.query()
      .where("follower_id", follower_uuid)
      .where("followee", followee_uuid)
      .delete();

    await Database.rawQuery(
      "update users set users.follower_count = users.follower_count - 1 \
                               where users.uuid = :follower_uuid",
      { follower_uuid }
    )

    await Database.rawQuery(
      "update users set  users.followee_count = users.followee_count - 1 where users.uuid = :followee_uuid",
      { followee_uuid }
    );

    return { success: true };
  }
}
