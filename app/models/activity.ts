import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Round from '#models/round'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Activity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => Round, {
    pivotTable: 'rounds_activity_links',
    pivotForeignKey: 'activity_id',
    pivotRelatedForeignKey: 'round_id',
    pivotColumns: ['id'],
  })
  declare rounds: relations.ManyToMany<typeof Round>
}
