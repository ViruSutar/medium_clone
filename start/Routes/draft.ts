import Route from '@ioc:Adonis/Core/Route'

Route.post('drafts/create','ArticlesController.createDraft')
Route.get('drafts/list','ArticlesController.listDrafts')
Route.get('drafts/getdraft','ArticlesController.getDraftDetails')
Route.put('drafts/update','ArticlesController.createDraft')
Route.delete('drafts/delete','ArticlesController.createDraft')

