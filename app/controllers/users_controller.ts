import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
    async create({request ,response}:HttpContext){
        let data = request.only(["nom","prenom","email","password"]);

        await User.create({
            nom:data.nom,
            prenom:data.prenom,
            email:data.email,
            password:data.password

        })

        response.redirect('/login')

    }
    async connexion({request ,auth , response}:HttpContext){
        const data = request.all();

        const user = await User.verifyCredentials(data.email, data.password)

        await auth.use('web').login(user)
    
        response.redirect('/')
        
    }
}