import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'


export default class Publication extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare texte:string

  @column()
  declare idUtilisateur:number 

  @column()
  declare media:string

  @column()
  declare nombreLike:number

  @column()
  declare nombreRetweet:number

  @column()
  declare nombreCommentaire:number

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