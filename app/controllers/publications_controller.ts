import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Publication from '#models/publication'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'


export default class PublicationsController {
    async create({request ,auth}:HttpContext){
        const texteTweet:string = request.input("texteTweet");
        const image = request.file('image');
        const User = Publication.findByOrFail("id_utilisateur", auth.user?.id);
        const tweet = Media.findByOrFail("id_publication", (await User).id);
        
        if(image){
            await image.move(app.publicPath('storage/uploads'),{
                name: `${cuid()}.${image.extname}`
              });
            (await tweet).photo = String(image?.fileName);
        }
       
        (await User).texte = texteTweet;
        (await tweet).save();
    }
}