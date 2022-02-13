import Route from '@ioc:Adonis/Core/Route'

Route.post('auth/register','AuthController.RegisterUser')
Route.post('auth/login','AuthController.login')

