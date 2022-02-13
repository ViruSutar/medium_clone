import Route from '@ioc:Adonis/Core/Route'


Route.post('comment/create','CommentsController.writeComment').middleware('checkAccess')
Route.get('comment/listCommentsByArticleId','CommentsController.listCommentsByArticleId')
Route.put('comment/update','CommentsController.editComment').middleware('checkAccess')
Route.delete('comment/delete','CommentsController.deleteComment').middleware('checkAccess')



//replies
Route.post('comment/replyToComment','CommentsController.replyToComment')
Route.get('getCommentByIdWithReply','CommentsController.getCommentByIdWithReply')


    