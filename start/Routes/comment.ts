import Route from '@ioc:Adonis/Core/Route'


Route.post('createComment','CommentsController.createComment')
Route.get('listCommentsByArticleId','CommentsController.listCommentsByArticleId')
Route.put('updateComment','CommentsController.updateComment')
Route.delete('deleteComment','CommentsController.deleteComment')



//replies
Route.post('replyToComment','CommentsController.replyToComment')
Route.get('getCommentByIdWithReply','CommentsController.getCommentByIdWithReply')


    