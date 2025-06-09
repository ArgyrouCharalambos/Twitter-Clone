import Message from '#models/message'
import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class MessagesController {
  async index({ view, auth }: HttpContext) {
    const userAll = (await User.query().whereNot('id', Number(auth.user?.id))).reverse()

    return view.render('pages/messages', { user: auth.user, userAll })
  }
  async messageCreate({ params, request, auth, response }: HttpContext) {
    let texte = request.input('texte')
    let image = request.file('image')

    let { id } = params


    if (image) {
      await image.move(app.makePath('public/uploads'), {
        name: `${cuid()}.${image.extname}`,
      })
    }

    if (texte !== 'null') {
      Message.create({
        texte: texte,
        media: image?.fieldName || 'null',
        idUtilisateurEnvoie: auth.user?.id,
        idUtilisateurRecu: id,
      })
    }

    response.redirect().back()
  }
  async getMessage({ params, auth, view }: HttpContext) {
    const userAll = (await User.query().whereNot('id', Number(auth.user?.id))).reverse()

    let { id } = params

    let userInconu = User.findOrFail(id)

    const messages = await Message.query()
      .where((groupeEnvoie) => {
        groupeEnvoie.where('idUtilisateurEnvoie', Number(auth.user?.id)).where('idUtilisateurRecu', id)
      })
      .orWhere((groupeRécupération) => {
        groupeRécupération.where('idUtilisateurEnvoie', id).where('idUtilisateurRecu', Number(auth.user?.id))
      })
      .orderBy('createdAt', 'asc')

    return view.render('pages/message_user', { userInconu, messages, user: auth.user, userAll })
  }
}
