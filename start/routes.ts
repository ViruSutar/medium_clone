/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import './Routes/article'
import './Routes/likes'
import './Routes/comment'
import './Routes/user'
import './Routes/draft'
import './Routes/bookmark'
import './Routes/notification'
import './Routes/auth'
import './Routes/tag'
import './Routes/follower'
import './Routes/author'
import './Routes/admin'
import './Routes/FrontEnd Routes/home'









Route.get('/', async () => {
  return { hello: 'world' }
})
