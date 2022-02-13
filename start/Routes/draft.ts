import Route from '@ioc:Adonis/Core/Route'

Route.post('drafts/create','ArticlesController.createDraft').middleware('checkAccess')
Route.get('drafts/list','ArticlesController.listDrafts').middleware('checkAccess')
Route.get('drafts/getdraft','ArticlesController.getDraftDetails').middleware('checkAccess')
Route.put('drafts/update','ArticlesController.updateDraft').middleware('checkAccess')
Route.delete('drafts/delete','ArticlesController.deleteDraft').middleware('checkAccess')
Route.post('drafts/publish','ArticlesController.publishArticle').middleware('checkAccess')