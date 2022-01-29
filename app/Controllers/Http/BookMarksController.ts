// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BookMarkService from "App/Services/BookMarksService";
import BookMarkValidator from "App/Validators/BookMarkValidator";

export default class BookMarksController {
  public async addBookMark({ request, response }) {
    let { user_uuid, article_id } = request.all();

    await request.validate(BookMarkValidator.addBookMark);
    await BookMarkService.addBookMark(user_uuid, article_id);

    return response.send({ success: true });
  }

  public async removeBookMark({ request, response }) {
    let {bookmark_id } = request.all();

    await request.validate(BookMarkValidator.removeBookMark);

    let bookmark = await BookMarkService.removeBookMark(bookmark_id);

    if (bookmark.success === false) {
      return response
        .status(404)
        .send({ success: false, message: bookmark.message });
    }

    return response.send({ success: true });
  }

  public async listBookMarks({request,response}){
    let {user_uuid}=request.all()
     
    let bookmarks=await BookMarkService.listBookMarks(user_uuid)

    return response.send({success:true,bookmarks})
  }
}
