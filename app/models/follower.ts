import { DateTime } from 'luxon'
import { BaseModel, column,  } from '@adonisjs/lucid/orm'

export default class Follower extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUtilisateur: number
 // user 
 
  @column()
  declare idUtilisateurAbonne: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}