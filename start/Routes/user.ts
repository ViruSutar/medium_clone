import Route from '@ioc:Adonis/Core/Route'


Route.patch('user/update','UsersController.updateUser').middleware('checkAccess')
Route.post('user/password-reset','UsersController.PasswordReset').middleware('checkAccess')
Route.delete('user/delete','UsersController.deleteUser').middleware('checkAccess')




//User
// Route.get('getUserById','UsersController.getUserById').middleware('checkAccess')

//Notification
// Route.get('getUserNotificationById','UsersController.getUserNotificationById')

// //Bookmark
// Route.post('addBookMark','UsersController.addBookMark')
// Route.get('listBookMarksByUserId','UsersController.listBookMarksByUserId')
// Route.delete('deleteBookMark','UsersController.deleteBookMark')

// //Admin requests
// Route.get('listUsers','UsersController.listUsers')

// //Authentication
// Route.post('login','UsersController.login')
// Route.get('logOut','UsersController.logOut')

