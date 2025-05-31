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


router.on('/').render('pages/home')
router.on('/login').render('security/login')
router.on('/profil').render('pages/profil')
router.post('/create' , [PublicationsController , 'create'])