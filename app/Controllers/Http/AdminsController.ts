// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AdminService from "App/Services/AdminService";
import TagValidator from "App/Validators/TagValidator";

export default class AdminsController {
  public async listAuthors({ request, response }) {
    let { limit, offset } = request.all();
    let user_uuid = request.user.user_uuid;
    let authors = await AdminService.listAuthors(limit, offset, user_uuid);

    return response.send({ success: true, authors });
  }

  public async createTag({ request, response }) {
    let { tag_name, image_link, description } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(TagValidator.createTag);
    let tag = await AdminService.createTag(
      tag_name,
      user_uuid,
      image_link,
      description
    );

    return response.status(200).send({ success: true, tagId: tag.tagId });
  }
  public async deleteTag({ request, response }) {
    let { tag_id } = request.all();
    let user_uuid = request.user.user_uuid;

    let tag = await AdminService.deleteTag(tag_id, user_uuid);

    if (tag.success === false) {
      return response
        .status(tag.status_code)
        .send({ success: false, message: tag.message });
    }

    return response.send({ success: true, message: tag.message });
  }

  public async updateTag({ request, response }) {
    let { tag_id, tag_name, status, image_link } = request.all();

    await request.validate(TagValidator.updateTag);

    let tag = await AdminService.updateTag(
      tag_id,
      tag_name,
      status,
      image_link
    );

    if (tag?.success === false) {
      return response
        .status(tag.status_code)
        .send({ success: false, message: tag.message });
    }

    return response.send({ success: true, messsage: tag?.message });
  }

  public async listTagsAdmin({ request, response }) {
    let { limit, offset, status, date } = request.all();
    let user_uuid = request.user.user_uuid;

    let tags = await AdminService.listTagsAdmin(
      user_uuid,
      status,
      limit,
      offset,
      date
    );

    return response.send({ success: true, tags: tags.tags });
  }

  public async rejectTag({ request, response }) {
    let { tag_id, rejection_note } = request.all();

    await request.validate(TagValidator.rejectTag);

    let tag = await AdminService.rejectTag(tag_id, rejection_note);

    if (tag?.success === false) {
      return response
        .status(tag.status_code)
        .send({ success: false, message: tag.message });
    }

    return response.send({ success: true });
  }
}
