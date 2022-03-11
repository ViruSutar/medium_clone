import Route from '@ioc:Adonis/Core/Route'

// This is admin route
Route.post('tag/create','TagsController.createTag').middleware('checkAccess').middleware('isAdmin')
Route.delete('tag/delete','TagsController.deleteTag').middleware('checkAccess').middleware('isAdmin')
Route.put('tag/update','TagsController.updateTag').middleware('checkAccess').middleware('isAdmin')
Route.get('tag/admin/list','TagsController.listTagsAdmin').middleware('checkAccess').middleware('isAdmin')
Route.post('tag/admin/reject','TagsController.rejectTag').middleware('checkAccess').middleware('isAdmin')



// These routes for users
Route.get('tag/search','TagsController.searchTag').middleware('checkAccess')
Route.get('tag/list','TagsController.listTags').middleware('checkAccess')
Route.post('tag/request','TagsController.RequestForTag').middleware('checkAccess')


