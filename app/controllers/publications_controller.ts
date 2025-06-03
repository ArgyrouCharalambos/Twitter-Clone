import type { HttpContext } from '@adonisjs/core/http'
import Publication from '#models/publication'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import User from '#models/user'
import Follower from '#models/follower'
import Following from '#models/following'


export default class PublicationsController {

    async home({view ,auth}:HttpContext){
        const publication = await Publication.all()
        const userAll = await User.query().whereNot('id',Number(auth.user?.id));


        const existeOuPas = await Following.findManyBy("id_utilisateur" , auth.user?.id);

        let tableauAbonnement = [];

        for(let e of existeOuPas){
            tableauAbonnement.push(e.idUtilisateurAbonnement)
        }


        return view.render('pages/home',{user:auth.user ,publication,userAll,tableauAbonnement})
    };

    async profil({view ,auth}:HttpContext){

        const abonné = await Follower.query().where("id_utilisateur", Number(auth.user?.id)).count('* as total1');
        const total1 = abonné[0].$extras.total1;
        const abonnement = await Following.query().where("id_utilisateur", Number(auth.user?.id)).count('* as total2');
        const total2 = abonnement[0].$extras.total2;

        const userAll = await User.query().whereNot('id',Number(auth.user?.id) );

        const publication = await Publication.findManyBy("id_utilisateur", auth.user?.id);
        const count = await Publication.query().where("id_utilisateur", Number(auth.user?.id)).count('* as total');
        const totalPost = count[0].$extras.total

        const existeOuPas = await Following.findManyBy("id_utilisateur" , auth.user?.id);

        let tableauAbonnement = [];

        for(let e of existeOuPas){
            tableauAbonnement.push(e.idUtilisateurAbonnement)
        }

        return view.render('pages/profil',{user:auth.user ,publication,totalPost,userAll,total1,total2,tableauAbonnement})
    };
    
    async create({request ,auth,response}:HttpContext){
        const texteTweet:string = request.input("texteTweet");
        const image = request.file('image');

        if(image){
            await image.move(app.makePath('public/uploads'),{
                name: `${cuid()}.${image.extname}`
              });
        };

        await Publication.create({
            texte:texteTweet,
            idUtilisateur: auth.user?.id,
            media:image?.fileName
        });

        response.redirect('/');

    }
}