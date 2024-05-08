import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Adventure from '#models/adventure'

export default class Collaborator extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare score: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => User, {
    pivotTable: 'collaborators_user_links',
    pivotForeignKey: 'collaborator_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['id'],
  })
  declare user: relations.ManyToMany<typeof User>

  @manyToMany(() => Adventure, {
    pivotTable: 'collaborators_adventure_links',
    pivotForeignKey: 'collaborator_id',
    pivotRelatedForeignKey: 'adventure_id',
    pivotColumns: ['id'],
  })
  declare adventure: relations.ManyToMany<typeof Adventure>
}
