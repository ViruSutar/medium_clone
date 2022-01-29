import Route from '@ioc:Adonis/Core/Route'

Route.post('bookmark/add','BookMarksController.addBookMark')
Route.delete('bookmark/remove','BookMarksController.removeBookMark')
Route.get('bookmark/list','BookMarksController.listBookMarks')

