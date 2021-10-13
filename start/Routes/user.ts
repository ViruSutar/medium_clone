import Route from '@ioc:Adonis/Core/Route'


//Notification
Route.get('getUserNotificationById','UsersController.getUserNotificationById')

//Bookmark
Route.post('addBookMark','UsersController.addBookMark')
Route.get('listBookMarksByUserId','UsersController.listBookMarksByUserId')
Route.delete('deleteBookMark','UsersController.deleteBookMark')

