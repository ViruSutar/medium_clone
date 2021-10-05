import Route from '@ioc:Adonis/Core/Route'

Route.post('/follow','AuthorFollowersController.follow')
Route.delete('/unfollow','AuthorFollowersController.unfollow')
