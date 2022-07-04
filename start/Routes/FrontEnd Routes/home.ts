import Route from '@ioc:Adonis/Core/Route'

Route.get('/home', async ({ view }) => {
    return view.render('home',{
      greeting:'Hello'
    })
  })