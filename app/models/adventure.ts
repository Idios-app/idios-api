import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Collaborator from '#models/collaborator'

export default class Adventure extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare streak: number

  //Relationship
  @manyToMany(() => User, {
    pivotTable: 'adventures_owner_links',
    pivotForeignKey: 'adventure_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['id'],
  })
  declare owner: relations.ManyToMany<typeof User>

  @manyToMany(() => Collaborator, {
    pivotTable: 'collaborators_adventure_links',
    pivotForeignKey: 'adventure_id',
    pivotRelatedForeignKey: 'collaborator_id',
    pivotColumns: ['id'],
  })
  declare collaborators: relations.ManyToMany<typeof Collaborator>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
