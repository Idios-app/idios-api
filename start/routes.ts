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
const AccessCodesController = () => import('#controllers/access_codes_controller')
const AdventuresController = () => import('#controllers/adventures_controller')
const DebugsController = () => import('#controllers/debugs_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const SessionController = () => import('#controllers/sessions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/users', [UsersController, 'index'])

router
  .group(() => {
    router.get('/loading', [SessionController, 'getAllByUserId'])

    router.resource('adventures', AdventuresController).only(['store', 'show', 'edit', 'destroy'])
    router.resource('code', AccessCodesController).only(['store', 'show'])
  })
  .use(middleware.auth())

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
