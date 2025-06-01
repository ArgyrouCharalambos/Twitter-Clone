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

router.get('/' , [PublicationsController , 'home']).use(middleware.auth()) 
router.get('/profil' , [PublicationsController , 'profil']).use(middleware.auth()) 
router.post('/create' , [PublicationsController , 'create']).use(middleware.auth()) 