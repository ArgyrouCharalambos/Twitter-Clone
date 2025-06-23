import type { HttpContext } from '@adonisjs/core/http'
import Publication from '#models/publication'
import { cuid } from '@adonisjs/core/helpers'
import User from '#models/user'
import Following from '#models/following'
import Like from '#models/like'
import Retweet from '#models/retweet'
import Commentaire from '#models/commentaire'

import supabase from '#start/supabase'
import { promises as fs } from 'fs'

export default class PublicationsController {
  async home({ view, auth }: HttpContext) {

    const userPublication = (
      await Publication.query()
        .preload('user')
        .preload('retweet', (e) => {
          e.preload('publication')
        })
    ).reverse()

    const userAll = (await User.query().whereNot('id', Number(auth.user?.id)).limit(3)).reverse()

    const existeOuPaslikeVerifie = await Like.findManyBy('id_utilisateur_like', auth.user?.id)
    const existeOuPasCommentaireVerifie = await Commentaire.findManyBy(
      'id_utilisateur',
      auth.user?.id
    )
    const existeOuPasretweetVerifie = await Retweet.findManyBy(
      'id_utilisateur_retweet',
      auth.user?.id
    )
    const existeAbonne = await Following.findManyBy('id_utilisateur', auth.user?.id)

    let likeVerifie = []
    let CommentaireVerifie = []
    let retweetVerifie = []
    let tableauAbonnement = []

    for (let e of existeAbonne) {
      tableauAbonnement.push(e.idUtilisateurAbonnement)
    }

    for (let e of existeOuPaslikeVerifie) {
      likeVerifie.push(e.idPublication)
    }

    for (let e of existeOuPasCommentaireVerifie) {
      CommentaireVerifie.push(e.idPublication)
    }
    for (let e of existeOuPasretweetVerifie) {
      retweetVerifie.push(e.idPublication)
    }

    return view.render('pages/home', {
      user: auth.user,
      userPublication,
      userAll,
      likeVerifie,
      CommentaireVerifie,
      retweetVerifie,
      tableauAbonnement,
    })
  }

  async create({ request, auth, response }: HttpContext) {
    const texteTweet: string = request.input('texteTweet')
    const image = request.file('image')

    if (image && texteTweet !== null) {

      const buffer = await fs.readFile(image.tmpPath!)
      const fileName = `${cuid()}.${image.extname}`

      await supabase.storage
      .from('image')
      .upload(fileName, buffer, {
        contentType: image.type,
        upsert: true,
      })
      

      // await image.move(app.makePath('public/uploads'), {
      //   name: `${cuid()}.${image.extname}`,
      // })
   
      const  {data}  = supabase.storage.from('image').getPublicUrl(fileName)


      await Publication.create({
        texte: texteTweet,
        idUtilisateur: auth.user?.id,
        media: data.publicUrl ?? 'null'
      })
    }

    response.redirect().back()
  }
  async like({ params, response, auth }: HttpContext) {
    const { id } = params
    const publication = await Publication.findOrFail(id)

    const verification = await Like.query()
      .where('id_publication', id)
      .andWhere('id_utilisateur_like', Number(auth.user?.id))
      .first()

    if (verification) {
      await verification.delete()
      publication.nombreLike = publication.nombreLike - 1
      await publication.save()
    } else {
      await Like.create({
        idPublication: id,
        idUtilisateur: publication.idUtilisateur,
        idUtilisateurLike: auth.user?.id,
      })
      publication.nombreLike = publication.nombreLike + 1

      await publication.save()
    }
    response.redirect().back()
  }
  async retweet({ params, response, auth }: HttpContext) {
    const { id } = params
    const publication = await Publication.findOrFail(id)

    const verification = await Retweet.query()
      .where('id_publication', id)
      .andWhere('id_utilisateur_retweet', Number(auth.user?.id))
      .first()

    if (verification) {
      await verification.delete()
      publication.nombreRetweet = publication.nombreRetweet - 1

      const verification2 = await Publication.findOrFail(verification.idPublicationRetweet)
      if (verification2) {
        await verification2.delete()
      }
    } else {
      publication.nombreRetweet = publication.nombreRetweet + 1

      const publications = await Publication.create({
        idUtilisateur: auth.user?.id,
        texte: publication.texte,
        media: publication.media,
        nombreRetweet: publication.nombreRetweet,
        nombreLike: publication.nombreLike,
        nombreCommentaire: publication.nombreCommentaire,
      })

      await Retweet.create({
        idPublication: id,
        idPublicationRetweet: publications.id,
        idUtilisateur: publication.idUtilisateur,
        idUtilisateurRetweet: auth.user?.id,
      })
    }

    await publication.save()

    response.redirect().back()
  }
  async commentaire({ request, params, response, auth }: HttpContext) {
    const texteTweet: string = request.input('texteTweet')
    const image = request.file('image_commentaire')
    const publications = Publication.findOrFail(params.id)

   

    if (image && texteTweet !== null) {

      ;(await publications).nombreCommentaire = (await publications).nombreCommentaire + 1
      ;(await publications).save()

      const buffer = await fs.readFile(image.tmpPath!)
      const fileName = `${cuid()}.${image.extname}`

      await supabase.storage
      .from('image')
      .upload(fileName, buffer, {
        contentType: image.type,
        upsert: true,
      })
   
      const  {data}  = supabase.storage.from('image').getPublicUrl(fileName)

      await Commentaire.create({
        texte: texteTweet,
        idUtilisateur: auth.user?.id,
        idPublication: params.id,
        media: data.publicUrl
      })

    }

   

    response.redirect().back()
  }
  async getCommentaire({ view, params, auth }: HttpContext) {
    const { id } = params

    const publication = await Publication.findOrFail(id)

    const commentaire = await Commentaire.query().where('idPublication', id).preload('user')

    return view.render('pages/tweet', { commentaire, publication, user: auth.user })
  }
}
