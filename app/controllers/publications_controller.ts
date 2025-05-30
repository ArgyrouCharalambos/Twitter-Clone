import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Publication from '#models/publication'


export default class PublicationsController {
    async create({request}:HttpContext){
        let texteTweet = request.input('texteTweet')
        let image = request.file('image')




    }
}