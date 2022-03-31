import Route from '@ioc:Adonis/Core/Route'

Route.get('admin/author/list','AdminsController.listAuthors').middleware('checkAccess').middleware('isAdmin')
Route.post('admin/tag/create','AdminsController.createTag').middleware('checkAccess').middleware('isAdmin')
Route.delete('admin/tag/delete','AdminsController.deleteTag').middleware('checkAccess').middleware('isAdmin')
Route.put('admin/tag/update','AdminsController.updateTag').middleware('checkAccess').middleware('isAdmin')
Route.get('admin/tag/list','AdminsController.listTagsAdmin').middleware('checkAccess').middleware('isAdmin')
Route.post('admin/tag/reject','AdminsController.rejectTag').middleware('checkAccess').middleware('isAdmin')