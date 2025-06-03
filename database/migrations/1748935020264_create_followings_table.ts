import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'followings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_utilisateur_abonnement')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}