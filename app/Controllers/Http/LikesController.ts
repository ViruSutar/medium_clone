import LikeService from "App/Services/LikeService";
import LikeValidator from "App/Validators/LikeValidator";

export default class LikesController {
  public async addLike({ request, response }) {
    let { article_id } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(LikeValidator.addLike);

    let like = await LikeService.addLike(article_id, user_uuid);

    if (like.success === false) {
      return response
        .status(like.status_code)
        .send({ success: false, message: like.message });
    }

    return response.send({ success: true });
  }

  public async removeLike({ request, response }) {
    let { article_id } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(LikeValidator.addLike);

    let like = await LikeService.removeLike(article_id, user_uuid);

    if (like.success === false) {
      return response
        .status(like.status_code)
        .send({ success: false, message: like.message });
    }

    return response.send({ success: true });
  }
}
