import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import Follower from "App/Models/Follower";
import SubscribersList from "App/Models/SubscribersList";
import User from "App/Models/User";
import NotificationService from "./NotificationService";

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
    )

    let user_name = await User.findBy("uuid", follower_uuid);
    // TODO: before writing apis think what you want to write or write down if api is big and then execute then you won't missout things
    
    let notification = `${user_name?.name} started following you`;
    
    // TODO: run this api after some time  read about push notifications 
    NotificationService.createNotification(followee_uuid, "follwers", notification);
    
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

  // static async subscribe(user_uuid:string,author_id:string){

  //  await SubscribersList.create({
  //      user_uuid,
  //      author_id
  //    })

  //    let user=await User.findBy("uuid",author_id)
  //    let author_name=user?.name
    
  //    return {success:true,message:`You have subscribed to ${author_name}`}
  // }

  static async listFollowers(user_uuid:string,limit:string,offset:string){

    if (!limit) {
      limit = "1000000000000000";
    }

    if (!offset) {
      offset = "0";
    }
    
   let [data,total]= await Promise.all([
    await Database.query()
    .select(Database.rawQuery(
      "users.name,users.profile_pic,users.user_bio"
    ))
    .from("followers")
    .join("users","users.uuid","=","followers.follower_id")
    .where("followers.followee",user_uuid)
    .limit(parseInt(limit))
    .offset(parseInt(offset))
    ,
    await Database.query()
    .select(Database.rawQuery(
      "count(distinct followers.id) as count"
    ))
    .from("followers")
    .where("followers.followee",user_uuid)
    .join("users","users.uuid","=","followers.follower_id")
                             
   ])

   return{success:true,data,
    total: total[0].length !== 0 ? total[0].count : 0,
  }

}
}
