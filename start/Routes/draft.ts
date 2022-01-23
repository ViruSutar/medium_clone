import Route from '@ioc:Adonis/Core/Route'

Route.post('drafts/create','ArticlesController.createDraft')
Route.get('drafts/list','ArticlesController.listDrafts')
Route.get('drafts/getdraft','ArticlesController.getDraftDetails')
Route.put('drafts/update','ArticlesController.updateDraft')
Route.delete('drafts/delete','ArticlesController.deleteDraft')
Route.post('drafts/publish','ArticlesController.publishArticle')