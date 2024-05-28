import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Round from '#models/round'
import Collaborator from '#models/collaborator'
import ActivityAnswer from '#models/activity_answer'

export default class ActivityVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => Round, {
    pivotTable: 'rounds_activity_votes_links',
    pivotForeignKey: 'activity_vote_id',
    pivotRelatedForeignKey: 'round_id',
    pivotColumns: ['id'],
  })
  declare round: relations.ManyToMany<typeof Round>

  @manyToMany(() => Collaborator, {
    pivotTable: 'activity_votes_collaborator_links',
    pivotForeignKey: 'activity_vote_id',
    pivotRelatedForeignKey: 'collaborator_id',
    pivotColumns: ['id'],
  })
  declare collaborator: relations.ManyToMany<typeof Collaborator>

  @manyToMany(() => ActivityAnswer, {
    pivotTable: 'activity_votes_activity_answer_links',
    pivotForeignKey: 'activity_vote_id',
    pivotRelatedForeignKey: 'activity_answer_id',
    pivotColumns: ['id'],
  })
  declare answer: relations.ManyToMany<typeof ActivityAnswer>
}
