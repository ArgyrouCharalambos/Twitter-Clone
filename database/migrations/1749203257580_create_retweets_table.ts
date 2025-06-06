import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'retweets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_publication_retweet')

    })
  }


}