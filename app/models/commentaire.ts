import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Commentaire extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idPublication: number

  @column()
  declare idUtilisateur: number

  @column()
  declare texte: string

  @hasOne(() => User,{
    foreignKey: 'id',
    localKey: 'idUtilisateur'
  })
  declare user: relations.HasOne<typeof User>

  @column()
  declare media: string

  @column()
  declare nombreLike:number

  @column()
  declare nombreRetweet:number

  @column()
  declare nombreCommentaire:number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}