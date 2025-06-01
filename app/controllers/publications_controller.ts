import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Publication from '#models/publication'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'


export default class PublicationsController {

    async home({view ,auth}:HttpContext){

        return view.render('pages/home',{user:auth.user})
    };

    async profil({view ,auth}:HttpContext){

        return view.render('pages/profil',{user:auth.user})
    };
    
    async create({request ,auth}:HttpContext){
        const texteTweet:string = request.input("texteTweet");
        const image = request.file('image');

        if(image){
            await image.move(app.publicPath('storage/uploads'),{
                name: `${cuid()}.${image.extname}`
              });
        }

        const pub = await Publication.create({
            texte:texteTweet,
            idUtilisateur: auth.user?.id
        })

        await Media.create({
            photo:image?.fileName,
            idPublication:pub.id
        })

    }
}