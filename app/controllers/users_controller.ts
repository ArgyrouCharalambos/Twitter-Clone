import Following from '#models/following';
import Publication from '#models/publication';
import User from '#models/user';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'


export default class UsersController {
    async create({request ,response,auth}:HttpContext){
        let data = request.only(["nom","prenom","email","password"]);

        await User.create({
            nom:data.nom,
            prenom:data.prenom,
            email:data.email,
            password:data.password

        })

        const user = await User.verifyCredentials(data.email, data.password)

        await auth.use('web').login(user)
    
        response.redirect('/')

    }
    async connexion({request ,auth , response}:HttpContext){
        const data = request.all();

        const user = await User.verifyCredentials(data.email, data.password)

        await auth.use('web').login(user)
    
        response.redirect('/')
        
    }
    async uptade({request,response,auth}:HttpContext){
        
        let nom = request.input('nom')
        let prenom = request.input('prenom')
        let localisation = request.input('localisation')
        let biographie = request.input('biographie')
        let lien = request.input('lien')
        let photoDeProfil = request.file("photoDeProfil")
        let photoDeCouverture = request.file("photoDeCouverture")
        let user = await User.findOrFail(auth.user?.id)

        if(nom){
            user.nom = nom
        }
        if(prenom){
            user.prenom = prenom
        }
        if(prenom){
            user.localisation = localisation
        }
        if(biographie){
            user.biographie = biographie
        }
        if(lien){
            user.lien = lien
        }
        if(photoDeProfil){
            await photoDeProfil.move(app.makePath('public/uploads'),{
                name: `${cuid()}.${photoDeProfil.extname}`
              });
              let photo = photoDeProfil?.fileName;
                user.photoDeProfil = String(photo) ;

        };
        if(photoDeCouverture){
            await photoDeCouverture.move(app.makePath('public/uploads'),{
                name: `${cuid()}.${photoDeCouverture.extname}`
              });
              let photo = photoDeCouverture?.fileName
              user.photoDeCouverture = String(photo)

        };

        await user.save();

        response.redirect().back()

    }

    async profilUtilisateur({view,params,auth}:HttpContext){
        let id = params.id
        let users = User.findOrFail(id)

   const abonné = await Following.query().where("id_utilisateur_abonnement",id).count('* as total1');
       const total1 = abonné[0].$extras.total1;
      const abonnement = await Following.query().where("id_utilisateur",id).count('* as total2');
      const total2 = abonnement[0].$extras.total2;

        const count = await Publication.query().where("id_utilisateur", id).count('* as total');
              const totalPost = count[0].$extras.total

       const publication = await Publication.findManyBy("id_utilisateur", id);
            
        

         const existeOuPas = await Following.findManyBy("id_utilisateur" , auth.user?.id);
            
            let tableauAbonnement = [];
        
            for(let e of existeOuPas){
                tableauAbonnement.push(e.idUtilisateurAbonnement)
            }

       const userAll = await User.query().whereNot('id',Number(auth.user?.id) );
        
        return view.render('pages/profil_utilisateur',{users,publication,totalPost,total1,total2,userAll,user:auth.user,tableauAbonnement})
    }

}