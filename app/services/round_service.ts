import Round from '#models/round'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'
import Timeline from '#models/timeline'

@inject()
export class RoundService {
  constructor(protected activityService: ActivityService) {}

  async save(timeline: Timeline) {
    const round = new Round()
    const result = await round.save()

    const activity = await this.activityService.getRandomActivity()
    await result.related('activity').attach([activity.id])
    await result.related('timeline').attach([timeline.id])

    return result
  }
}
