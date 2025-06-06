import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Retweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idPublication: number

  @column()
  declare idPublicationRetweet: number

  @column()
  declare idUtilisateur: number

  @column()
  declare idUtilisateurRetweet: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}