/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const DebugsController = () => import('#controllers/debugs_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/users', [UsersController, 'index'])

//Registration
router
  .group(() => {
    //router.post('register', [AuthController, 'register'])
    router.post('partial', [AuthController, 'registerPartial'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('me', [AuthController, 'authenticatedUser']).use(middleware.auth())
  })
  .prefix('user')

//Admin
router
  .group(() => {
    router.post('try', [DebugsController, 'try'])
  })
  .prefix('admin')
  .use(middleware.admin())
