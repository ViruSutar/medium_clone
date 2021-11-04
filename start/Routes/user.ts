import Route from '@ioc:Adonis/Core/Route'

//User
Route.get('getUserById','UsersController.getUserById').middleware('checkAccess:READER')
Route.post('createUser','UsersController.createUser')


//Notification
Route.get('getUserNotificationById','UsersController.getUserNotificationById')

//Bookmark
Route.post('addBookMark','UsersController.addBookMark')
Route.get('listBookMarksByUserId','UsersController.listBookMarksByUserId')
Route.delete('deleteBookMark','UsersController.deleteBookMark')

//Admin requests
Route.get('listUsers','UsersController.listUsers')

//Authentication
Route.post('login','UsersController.login')
Route.get('logOut','UsersController.logOut')

