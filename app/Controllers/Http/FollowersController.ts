import Database from "@ioc:Adonis/Lucid/Database";
import FollowService from "App/Services/FollowService";

export default class FollowersController {
  public async follow({ request, response }) {
    let { followee_uuid } = request.all();
    let follower_uuid = request.user.user_uuid;

    let follow = await FollowService.follow(follower_uuid, followee_uuid);
    if(follow.success === false){
      return response.status(follow.status_code).send({success:false,message:follow.message})
    }
    return response.send({ success: true });
  }

  public async unfollow({ request, response }) {
    let { followee_uuid } = request.all();
    let follower_uuid = request.user.user_uuid;

    let unfollow = await FollowService.unfollow(follower_uuid, followee_uuid);


    if(unfollow.success === false){
      return response.status(unfollow.status_code).send({success:false,message:unfollow.message})
    }
    return response.send({ success: true });
  }
}
