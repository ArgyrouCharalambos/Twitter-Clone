import Following from '#models/following'
import User from '#models/user';
import { HttpContext } from '@adonisjs/core/http'

export default class FollowersAndFollowingsController {
  async followers({ auth, params, response }: HttpContext) {

    const userId:number = Number(auth.user?.id);
    const paramsId = Number(params.id);

    const verification = await Following.query()
      .where('id_utilisateur', userId)
      .andWhere('id_utilisateur_abonnement', paramsId).first();

    if (verification) {
      await verification.delete();

      // const verification2 = await Follower.query()
      //   .where('id_utilisateur_abonne', userId)
      //   .andWhere('id_utilisateur',paramsId).first();

      // if(verification2){
      //   await verification2.delete();
      // }


    } else {
      await Following.create({
        idUtilisateur:userId,
        idUtilisateurAbonnement: paramsId,
      });

      // await Follower.create({
      //   idUtilisateur: paramsId,
      //   idUtilisateurAbonne: userId,
      // });
    }
   response.redirect().back()

  }
  async getFollowers({view ,auth}:HttpContext){

    const userAll = await User.query().whereNot('id',Number(auth.user?.id) );


    const existeOuPas = await Following.findManyBy("id_utilisateur" , auth.user?.id);
    
    let tableauAbonnement = [];

    for(let e of existeOuPas){
        tableauAbonnement.push(e.idUtilisateurAbonnement)
    }
    
    const abonné = await Following.query().where("id_utilisateur_abonnement", Number(auth.user?.id)).whereNot('id_utilisateur',Number(auth.user?.id) ).preload("user")
  
    abonné.forEach((e)=>{
      console.log(e.user.nom)
    })

    return view.render("pages/followers" ,{abonné,tableauAbonnement,userAll,user:auth.user})
  }
  async getFollowings({view,auth}:HttpContext){

            const userAll = await User.query().whereNot('id',Number(auth.user?.id) );
    
            const existeOuPas = await Following.findManyBy("id_utilisateur" , auth.user?.id);
    
            let tableauAbonnement = [];
    
            for(let e of existeOuPas){
                tableauAbonnement.push(e.idUtilisateurAbonnement)
            }
    

    const abonnement = await Following.query().where("id_utilisateur",Number(auth.user?.id)).preload("userAbonnement")

    abonnement.forEach((e)=>{
      console.log(e.userAbonnement.nom)
    })

    return view.render("pages/followings",{abonnement,tableauAbonnement,userAll,user:auth.user})
  }
}
