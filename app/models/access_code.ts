import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Adventure from '#models/adventure'
import * as relations from '@adonisjs/lucid/types/relations'

export default class AccessCode extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column.dateTime({ autoCreate: true })
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => Adventure, {
    pivotTable: 'access_codes_adventure_links',
    pivotForeignKey: 'access_code_id',
    pivotRelatedForeignKey: 'adventure_id',
    pivotColumns: ['id'],
  })
  declare user: relations.ManyToMany<typeof Adventure>
}
