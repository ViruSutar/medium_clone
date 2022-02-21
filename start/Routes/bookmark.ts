import Route from '@ioc:Adonis/Core/Route'

Route.post('bookmark/add','BookMarksController.addBookMark').middleware('checkAccess')
Route.delete('bookmark/remove','BookMarksController.removeBookMark').middleware('checkAccess')
Route.get('bookmark/list','BookMarksController.listBookMarks').middleware('checkAccess')

