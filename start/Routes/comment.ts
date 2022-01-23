import Route from '@ioc:Adonis/Core/Route'


Route.post('comment/writeComment','CommentsController.writeComment')
Route.get('comment/listCommentsByArticleId','CommentsController.listCommentsByArticleId')
Route.put('comment/updateComment','CommentsController.updateComment')
Route.delete('comment/deleteComment','CommentsController.deleteComment')



//replies
Route.post('comment/replyToComment','CommentsController.replyToComment')
Route.get('getCommentByIdWithReply','CommentsController.getCommentByIdWithReply')


    