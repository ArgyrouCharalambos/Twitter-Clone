import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('photoDeProfil')
      table.dropColumn('photoDeCouverture')

      table.string('photo_de_profil').nullable
      table.string('photo_de_couverture').nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}