import Route from '@ioc:Adonis/Core/Route'

Route.post('/follow','FollowersController.follow').middleware('checkAccess')
Route.delete('/unfollow','FollowersController.unfollow').middleware('checkAccess')
