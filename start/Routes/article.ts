import Route from '@ioc:Adonis/Core/Route'

Route.post('/createArticle','ArticlesController.createArticle')
Route.get('/listArticles','ArticlesController.listArticles')
Route.get('/getArticleById','ArticlesController.getArticleById')
Route.post('/updateArticle','ArticlesController.updateArticle')
Route.get('/listTopAuthors','ArticlesController.listTopAuthors')



//subCategories
Route.get('/listSubCategories','ArticlesController.listSubCategories')
Route.post('/createSubCategories','ArticlesController.createSubCategories')
Route.put('/updateSubcategories','ArticlesController.updateSubcategories')
Route.delete('/deleteSubcategories','ArticlesController.deleteSubcategories')






