import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Adventure from '#models/adventure'
import * as relations from '@adonisjs/lucid/types/relations'
import Round from '#models/round'

export default class Timeline extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => Adventure, {
    pivotTable: 'timelines_adventure_links',
    pivotForeignKey: 'timeline_id',
    pivotRelatedForeignKey: 'adventure_id',
    pivotColumns: ['id'],
  })
  declare adventure: relations.ManyToMany<typeof Adventure>

  @manyToMany(() => Round, {
    pivotTable: 'rounds_timeline_links',
    pivotForeignKey: 'timeline_id',
    pivotRelatedForeignKey: 'round_id',
    pivotColumns: ['id'],
  })
  declare timeline: relations.ManyToMany<typeof Round>
}
