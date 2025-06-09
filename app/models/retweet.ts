import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Publication from '#models/publication'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Retweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idPublication: number 

  @hasOne(() => Publication,{
        foreignKey: 'id',
        localKey: 'idPublication'
      })
  declare publication: relations.HasOne<typeof Publication>

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