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
}