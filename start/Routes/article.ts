import Route from '@ioc:Adonis/Core/Route'

Route.post('/createArticle','ArticlesController.createArticle')
Route.get('/listArticles','ArticlesController.listArticles')
Route.get('/getArticleById','ArticlesController.getArticleById')
Route.post('/updateArticle','ArticlesController.updateArticle')




