import Round from '#models/round'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'
import Timeline from '#models/timeline'
import { DateTime } from 'luxon'
import RoundSelectedSubjectInterface from '../interfaces/round_selected_subject_interface.js'

@inject()
export class RoundService {
  constructor(protected activityService: ActivityService) {}

  async save(timeline: Timeline) {
    const round = new Round()
    const result = await round.save()

    const activity = await this.activityService.getRandomActivity()
    if (!activity) return null
    await result.related('activity').attach([activity.id])
    await result.related('timeline').attach([timeline.id])

    return result
  }

  async getTodayRound(timeline: Timeline) {
    const today = DateTime.now().startOf('day').toString()
    return await timeline.related('rounds').query().where('created_at', '>=', today).first()
  }

  async addTodayRound(timeline: Timeline) {
    //TODO : check if round available or streak broke

    return await this.save(timeline)
  }

  async updateRoundSubject(round: Round, params: RoundSelectedSubjectInterface) {
    round.selectedSubject = params
    return await round.save()
  }
}
