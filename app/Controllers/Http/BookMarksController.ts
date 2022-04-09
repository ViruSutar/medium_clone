// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BookMarkService from "App/Services/BookMarksService";
import BookMarkValidator from "App/Validators/BookMarkValidator";

export default class BookMarksController {
  public async addBookMark({ request, response }) {
    let { article_id,bookmark_folder } = request.all();
    let user_uuid = request.user.user_uuid;

    await request.validate(BookMarkValidator.addBookMark);
   let bookmark=  await BookMarkService.addBookMark(user_uuid, article_id,bookmark_folder);

   if(bookmark.success === false){
     return response.status(bookmark.status_code).send({success:false,message:bookmark.message})
   }

    return response.send({ success: true });
  }

  public async removeBookMark({ request, response }) {
    let { bookmark_id } = request.all();
    let user_uuid = request.user.user_uuid;
    
    await request.validate(BookMarkValidator.removeBookMark);

    let bookmark = await BookMarkService.removeBookMark(bookmark_id,user_uuid);
    
    if (bookmark.success === false) {

      return response
        .status(bookmark.status_code)
        .send({ success: false, message: bookmark.message });
    }

    return response.send({ success: true });
  }

  public async listBookMarks({ request, response }) {
    let user_uuid = request.user.user_uuid;

    let bookmarks = await BookMarkService.listBookMarks(user_uuid);

    return response.send({ success: true,count:bookmarks.total, bookmarks:bookmarks.bookmarks});
  }
}
