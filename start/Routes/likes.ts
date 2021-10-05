import Route from '@ioc:Adonis/Core/Route'


Route.post('/addLikeToArticle','LikesController.addLikeToArticle')
Route.post('/removeLike','LikesController.removeLike')