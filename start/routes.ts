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
const ActivitiesController = () => import('#controllers/activities_controller')
const CollaboratorsController = () => import('#controllers/collaborators_controller')
const AccessCodesController = () => import('#controllers/access_codes_controller')
const AdventuresController = () => import('#controllers/adventures_controller')
const DebugsController = () => import('#controllers/debugs_controller')
const AuthController = () => import('#controllers/auth_controller')
const SessionController = () => import('#controllers/sessions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.get('loading', [SessionController, 'getAllByUserId'])

    router.resource('adventures', AdventuresController).only(['store', 'show', 'edit', 'destroy'])
    router.get('adventures/:id/round', [AdventuresController, 'getTodayActivity'])
    router.post('adventures/:id/round/proposal', [AdventuresController, 'proposalAnswer'])
    router.post('adventures/:id/round/contribution', [AdventuresController, 'contributionAnswer'])

    router.resource('codes', AccessCodesController).only(['store', 'show'])
    router
      .resource('collaborators', CollaboratorsController)
      .only(['store', 'show', 'update', 'destroy'])
    router.resource('activities', ActivitiesController).only(['show'])
    router.get('activities/:id/recap', [ActivitiesController, 'showRecap'])
    router.get('activities/:id/vote', [ActivitiesController, 'showVote'])
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

router.get('/error', async () => {
  throw new Error('Test Sentry Error')
})

//Admin
router
  .group(() => {
    router.post('try', [DebugsController, 'try'])
  })
  .prefix('admin')
  .use(middleware.admin())
