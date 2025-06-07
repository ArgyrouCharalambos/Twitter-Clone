import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'commentaires'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('nombre_commentaire').defaultTo(0).notNullable
      table.integer('nombre_retweet').defaultTo(0).notNullable
      table.integer('nombre_like').defaultTo(0).notNullable
  })

}
}