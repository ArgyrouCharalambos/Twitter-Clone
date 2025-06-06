import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Like from '#models/like'
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

   @hasOne(() => User,{
      foreignKey: 'id',
      localKey: 'idUtilisateur'
    })
    declare user: relations.HasOne<typeof User>
  

    @hasMany(() => Like,{
      foreignKey: 'idUtilisateur',
      localKey: 'idUtilisateur'
    })
    declare like: relations.HasMany<typeof Like>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}