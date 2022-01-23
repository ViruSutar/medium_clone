import Route from '@ioc:Adonis/Core/Route'

Route.post('articles/createArticle','ArticlesController.createArticle')
Route.get('articles/listArticles','ArticlesController.listArticles')
Route.get('articles/getArticleById','ArticlesController.getArticleById')
Route.put('articles/updateArticle','ArticlesController.updateArticle')
Route.get('articles/listTopAuthors','ArticlesController.listTopAuthors')
Route.delete('articles/deleteArticle','ArticlesController.deleteArticle')




// //subCategories
// Route.get('/listSubCategories','ArticlesController.listSubCategories')
// Route.post('/createSubCategories','ArticlesController.createSubCategories')
// Route.put('/updateSubcategories','ArticlesController.updateSubcategories')
// Route.delete('/deleteSubcategories','ArticlesController.deleteSubcategories')






