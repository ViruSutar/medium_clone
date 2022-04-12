import Route from '@ioc:Adonis/Core/Route'

Route.get('author/list','AuthorsController.listAuthors').middleware('checkAccess')
Route.get('author/getDetails','AuthorsController.getAuthorDetails').middleware('checkAccess')


