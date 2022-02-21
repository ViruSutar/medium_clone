import Route from '@ioc:Adonis/Core/Route'


Route.post('like/add','LikesController.addLike').middleware('checkAccess')
Route.delete('likes/remove','LikesController.removeLike').middleware('checkAccess')