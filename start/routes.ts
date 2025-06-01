/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import PublicationsController from '#controllers/publications_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'

router.on('/login').render('security/login')

router.post('/signin' , [UsersController , 'create'])
router.get('/connexion' , [UsersController , 'connexion'])


router.on('/').render('pages/home').use(middleware.auth()) 
router.on('/profil').render('pages/profil').use(middleware.auth()) 
router.post('/create' , [PublicationsController , 'create']).use(middleware.auth()) 