import type { HttpContext } from '@adonisjs/core/http'
import Publication from '#models/publication'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import User from '#models/user'
import Following from '#models/following'
import Like from '#models/like'
import Retweet from '#models/retweet'


export default class PublicationsController {

    async home({view ,auth}:HttpContext){
        const userPublication = (await Publication.query().preload('like').preload('user')).reverse()

        const userAll = (await User.query().whereNot('id',Number(auth.user?.id)).limit(3)).reverse();



        const existeOuPas = await Following.findManyBy("id_utilisateur" , auth.user?.id);

        let tableauAbonnement = [];

        for(let e of existeOuPas){
            tableauAbonnement.push(e.idUtilisateurAbonnement)
        }


        return view.render('pages/home',{user:auth.user ,userPublication,userAll,tableauAbonnement})
    };

    async profil({view ,auth}:HttpContext){

        const abonné = await Following.query().where("id_utilisateur_abonnement", Number(auth.user?.id)).count('* as total1');
        const total1 = abonné[0].$extras.total1;
        const abonnement = await Following.query().where("id_utilisateur", Number(auth.user?.id)).count('* as total2');
        const total2 = abonnement[0].$extras.total2;

        const userAll = (await User.query().whereNot('id',Number(auth.user?.id) ).limit(3)).reverse();

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
    async like({params,response,auth}:HttpContext){
        const {id} = params;
       const publication = await Publication.findOrFail(id)

       const verification = await Like.query()
             .where('id_publication', id)
             .andWhere('id_utilisateur_like', Number(auth.user?.id)).first();

       if(verification){
        await verification.delete();
        publication.nombreLike = publication.nombreLike - 1 ;
       await publication.save();


       }
       else{
        await Like.create({
            idPublication:id,
            idUtilisateur:publication.idUtilisateur,
            idUtilisateurLike:auth.user?.id
       })
       publication.nombreLike = publication.nombreLike + 1 ;

       await publication.save();

       }
       response.redirect().back()
    

    }
    async retweet({params,response,auth}:HttpContext){
        const {id} = params;
       const publication = await Publication.findOrFail(id)

       const verification = await Retweet.query()
             .where('id_publication', id)
             .andWhere('id_utilisateur_retweet', Number(auth.user?.id)).first();


       if(verification){
        await verification.delete();
        publication.nombreRetweet = publication.nombreRetweet - 1 ;

        const verification2 = await Publication.findOrFail(verification.idPublicationRetweet);
        if(verification2){
        await verification2.delete();
        }
       }
       else{
      
       publication.nombreRetweet = publication.nombreRetweet + 1 ;

       const publications = await Publication.create({
        idUtilisateur:auth.user?.id,
        texte:publication.texte,
        media:publication.media,
        nombreRetweet:publication.nombreRetweet,
        nombreLike:publication.nombreLike
       })

        await Retweet.create({
            idPublication:id,
            idPublicationRetweet:publications.id,
            idUtilisateur:publication.idUtilisateur,
            idUtilisateurRetweet:auth.user?.id
       })
       
       }

       await publication.save();

       response.redirect().back()
    

    }

}