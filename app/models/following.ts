import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'


export default class Following extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUtilisateur: number

  @column()
  declare idUtilisateurAbonnement: number

  @hasOne(() => User,{
    foreignKey: 'id',
    localKey: 'idUtilisateurAbonnement'
  })
  declare userAbonnement: relations.HasOne<typeof User>

  @hasOne(() => User,{
    foreignKey: 'id',
    localKey: 'idUtilisateur'
  })
  declare user: relations.HasOne<typeof User>



  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}