import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Publication from '#models/publication'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import User from '#models/user'


export default class PublicationsController {

    async home({view ,auth}:HttpContext){

        const publication = await Publication.all()
        const userAll = await User.all()
        
        return view.render('pages/home',{user:auth.user ,publication,userAll})
    };

    async profil({view ,auth}:HttpContext){
        const userAll = await User.all()
        console.log(userAll)

        const publication = await Publication.findManyBy("id_utilisateur", auth.user?.id);
        const count = await Publication.query().where("id_utilisateur", Number(auth.user?.id)).count('* as total');
        const total = count[0].$extras.total

        // const media = await Media.findByOrFail("id_publication", );

        return view.render('pages/profil',{user:auth.user ,publication,count:[total],userAll})
    };
    
    async create({request ,auth,response}:HttpContext){
        const texteTweet:string = request.input("texteTweet");
        const image = request.file('image');

        if(image){
            await image.move(app.makePath('storage/uploads'),{
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
        response.redirect('/')

    }
}