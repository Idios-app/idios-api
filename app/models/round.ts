import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Timeline from '#models/timeline'
import * as relations from '@adonisjs/lucid/types/relations'
import Activity from '#models/activity'
import ActivityVote from '#models/activity_vote'
import ActivityAnswer from '#models/activity_answer'
import type RoundSelectedSubjectInterface from '../interfaces/round_selected_subject_interface.js'

export default class Round extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare selectedSubject: RoundSelectedSubjectInterface

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relationship
  @manyToMany(() => Timeline, {
    pivotTable: 'rounds_timeline_links',
    pivotForeignKey: 'round_id',
    pivotRelatedForeignKey: 'timeline_id',
    pivotColumns: ['id'],
  })
  declare timeline: relations.ManyToMany<typeof Timeline>

  @manyToMany(() => Activity, {
    pivotTable: 'rounds_activity_links',
    pivotForeignKey: 'round_id',
    pivotRelatedForeignKey: 'activity_id',
    pivotColumns: ['id'],
  })
  declare activity: relations.ManyToMany<typeof Activity>

  @manyToMany(() => ActivityVote, {
    pivotTable: 'rounds_activity_votes_links',
    pivotForeignKey: 'round_id',
    pivotRelatedForeignKey: 'activity_vote_id',
    pivotColumns: ['id'],
  })
  declare votes: relations.ManyToMany<typeof ActivityVote>

  @manyToMany(() => ActivityAnswer, {
    pivotTable: 'activity_answers_round_links',
    pivotForeignKey: 'round_id',
    pivotRelatedForeignKey: 'activity_answer_id',
    pivotColumns: ['id'],
  })
  declare answers: relations.ManyToMany<typeof ActivityAnswer>
}
