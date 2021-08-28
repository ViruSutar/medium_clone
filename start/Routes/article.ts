import Route from '@ioc:Adonis/Core/Route'

Route.post('/createArticle','ArticlesController.createArticle')
Route.get('/listArticles','ArticlesController.listArticles')


