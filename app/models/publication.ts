import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Publication extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare texte:string

  @column()
  declare idUtilisateur:number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}