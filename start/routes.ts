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
import FollowersAndFollowingsController from '#controllers/followers_and_followings_controller'
import MessagesController from '#controllers/messages_controller'


router.on('/login').render('security/login')

router.post('/signin' , [UsersController , 'create'])
router.get('/connexion' , [UsersController , 'connexion'])

router.post('/edit' , [UsersController , 'uptade']).use(middleware.auth())

router.get('/messages' , [MessagesController , 'index']).use(middleware.auth())






router.get('/' , [PublicationsController , 'home']).use(middleware.auth()) 
router.get('/profil' , [PublicationsController , 'profil']).use(middleware.auth()) 
router.get('/like/:id' , [PublicationsController , 'like']).use(middleware.auth()) 
router.get('/getCommentaire/:id' , [PublicationsController , 'getCommentaire']).use(middleware.auth()) 
router.get('/retweet/:id' , [PublicationsController , 'retweet']).use(middleware.auth()) 
router.post('/create' , [PublicationsController , 'create']).use(middleware.auth())
router.post('/commentaire/:id' , [PublicationsController , 'commentaire']).use(middleware.auth())

router.get('/getFollowers' , [FollowersAndFollowingsController , 'getFollowers']).use(middleware.auth()) 
router.get('/getFollowings' , [FollowersAndFollowingsController , 'getFollowings']).use(middleware.auth()) 


router.get('/user/:id' , [UsersController , 'profilUtilisateur']).use(middleware.auth())

router.get('/getMessage/:id' , [MessagesController , 'getMessage']).use(middleware.auth())

router.post('/message/:id' , [MessagesController , 'messageCreate']).use(middleware.auth())
router.post('/followers/:id', [FollowersAndFollowingsController , 'followers']).use(middleware.auth()) 