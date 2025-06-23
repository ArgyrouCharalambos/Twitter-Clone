import Commentaire from '#models/commentaire'
import Following from '#models/following'
import Like from '#models/like'
import Publication from '#models/publication'
import Retweet from '#models/retweet'
import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'

import supabase from '#start/supabase'
import { promises as fs } from 'fs'

export default class UsersController {
  async create({ request, response, auth }: HttpContext) {
    let data = request.only(['nom', 'prenom', 'email', 'password'])

    await User.create({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password,
    })

    const user = await User.verifyCredentials(data.email, data.password)

    await auth.use('web').login(user)

    response.redirect('/')
  }
  async connexion({ request, auth, response }: HttpContext) {
    const data = request.all()

    const user = await User.verifyCredentials(data.email, data.password)

    await auth.use('web').login(user)

    response.redirect('/')
  }
  async uptade({ request, response, auth }: HttpContext) {
    let nom = request.input('nom')
    let prenom = request.input('prenom')
    let localisation = request.input('localisation')
    let biographie = request.input('biographie')
    let lien = request.input('lien')
    let photoDeProfil = request.file('photoDeProfil')
    let photoDeCouverture = request.file('photoDeCouverture')
    let user = await User.findOrFail(auth.user?.id)

    if (nom) {
      user.nom = nom
    }
    if (prenom) {
      user.prenom = prenom
    }
    if (prenom) {
      user.localisation = localisation
    }
    if (biographie) {
      user.biographie = biographie
    }
    if (lien) {
      user.lien = lien
    }
    if (photoDeProfil) {
      const buffer = await fs.readFile(photoDeProfil.tmpPath!)
      const fileName = `${cuid()}.${photoDeProfil.extname}`

      await supabase.storage
      .from('image')
      .upload(fileName, buffer, {
        contentType: photoDeProfil.type,
        upsert: true,
      })

      const  {data}  = supabase.storage.from('image').getPublicUrl(fileName)

      user.photoDeProfil = data.publicUrl
    }
    if (photoDeCouverture) {
      const buffer = await fs.readFile(photoDeCouverture.tmpPath!)
      const fileName = `${cuid()}.${photoDeCouverture.extname}`

      await supabase.storage
      .from('image')
      .upload(fileName, buffer, {
        contentType: photoDeCouverture.type,
        upsert: true,
      })

      const  {data}  = supabase.storage.from('image').getPublicUrl(fileName)

      user.photoDeCouverture = data.publicUrl
     
    }

    await user.save()

    response.redirect().back()
  }

  async profilUtilisateur({ view, params, auth }: HttpContext) {
    let id = params.id
    let users = User.findOrFail(id)

    const abonné = await Following.query()
      .where('id_utilisateur_abonnement', id)
      .count('* as total1')
    const total1 = abonné[0].$extras.total1
    const abonnement = await Following.query().where('id_utilisateur', id).count('* as total2')
    const total2 = abonnement[0].$extras.total2

    const count = await Publication.query().where('id_utilisateur', id).count('* as total')
    const totalPost = count[0].$extras.total

    const publication = await Publication.query()
      .where('id_utilisateur', id)
      .preload('retweet', (e) => {
        e.preload('publication')
      })

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

    const userAll = await User.query().whereNot('id', Number(auth.user?.id))

    return view.render('pages/profil_utilisateur', {
      likeVerifie,
      retweetVerifie,
      CommentaireVerifie,
      users,
      publication,
      totalPost,
      total1,
      total2,
      userAll,
      user: auth.user,
      tableauAbonnement,
    })
  }
  async profil({ view, auth }: HttpContext) {
    const abonné = await Following.query()
      .where('id_utilisateur_abonnement', Number(auth.user?.id))
      .count('* as total1')
    const total1 = abonné[0].$extras.total1
    const abonnement = await Following.query()
      .where('id_utilisateur', Number(auth.user?.id))
      .count('* as total2')
    const total2 = abonnement[0].$extras.total2

    const userAll = (await User.query().whereNot('id', Number(auth.user?.id)).limit(3)).reverse()

    const publication = await Publication.query()
      .where('id_utilisateur', Number(auth.user?.id))
      .preload('retweet', (e) => {
        e.preload('publication')
      })

    const count = await Publication.query()
      .where('id_utilisateur', Number(auth.user?.id))
      .count('* as total')
    const totalPost = count[0].$extras.total

    const existeOuPas = await Following.findManyBy('id_utilisateur', auth.user?.id)
    const existeOuPaslikeVerifie = await Like.findManyBy('id_utilisateur_like', auth.user?.id)
    const existeOuPasCommentaireVerifie = await Commentaire.findManyBy(
      'id_utilisateur',
      auth.user?.id
    )
    const existeOuPasretweetVerifie = await Retweet.findManyBy(
      'id_utilisateur_retweet',
      auth.user?.id
    )

    let tableauAbonnement = []
    let likeVerifie = []
    let CommentaireVerifie = []
    let retweetVerifie = []

    for (let e of existeOuPaslikeVerifie) {
      likeVerifie.push(e.idPublication)
    }

    for (let e of existeOuPasCommentaireVerifie) {
      CommentaireVerifie.push(e.idPublication)
    }
    for (let e of existeOuPasretweetVerifie) {
      retweetVerifie.push(e.idPublication)
    }

    for (let e of existeOuPas) {
      tableauAbonnement.push(e.idUtilisateurAbonnement)
    }

    return view.render('pages/profil', {
      retweetVerifie,
      CommentaireVerifie,
      likeVerifie,
      user: auth.user,
      publication,
      totalPost,
      userAll,
      total1,
      total2,
      tableauAbonnement,
    })
  }
}
