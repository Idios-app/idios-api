import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import ActivityVote from '#models/activity_vote'
import Round from '#models/round'
import Collaborator from '#models/collaborator'

export default class ActivityAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => ActivityVote, {
    pivotTable: 'activity_votes_activity_answer_links',
    pivotForeignKey: 'activity_answer_id',
    pivotRelatedForeignKey: 'activity_vote_id',
    pivotColumns: ['id'],
  })
  declare votes: relations.ManyToMany<typeof ActivityVote>

  @manyToMany(() => Round, {
    pivotTable: 'activity_answers_round_links',
    pivotForeignKey: 'activity_answer_id',
    pivotRelatedForeignKey: 'round_id',
    pivotColumns: ['id'],
  })
  declare round: relations.ManyToMany<typeof Round>

  @manyToMany(() => Collaborator, {
    pivotTable: 'activity_answers_collaborator_links',
    pivotForeignKey: 'activity_answer_id',
    pivotRelatedForeignKey: 'collaborator_id',
    pivotColumns: ['id'],
  })
  declare collaborator: relations.ManyToMany<typeof Collaborator>
}
