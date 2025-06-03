import Follower from '#models/follower'
import Following from '#models/following'
import type { HttpContext } from '@adonisjs/core/http'

export default class FollowersAndFollowingsController {
  async followers({ auth, params, response }: HttpContext) {

    const userId:number = Number(auth.user?.id);
    const paramsId = Number(params.id);

    const verification = await Following.query()
      .where('id_utilisateur', userId)
      .andWhere('id_utilisateur_abonnement', paramsId).first();

    if (verification) {
      await verification.delete();

      const verification2 = await Follower.query()
        .where('id_utilisateur_abonne', userId)
        .andWhere('id_utilisateur',paramsId).first();

      if(verification2){
        await verification2.delete();
      }


    } else {
      await Following.create({
        idUtilisateur:userId,
        idUtilisateurAbonnement: paramsId,
      });

      await Follower.create({
        idUtilisateur: paramsId,
        idUtilisateurAbonne: userId,
      });
    }
   response.redirect().back()

  }
}
