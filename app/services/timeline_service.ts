import Adventure from '#models/adventure'
import Timeline from '#models/timeline'
import { inject } from '@adonisjs/core'
import { RoundService } from '#services/round_service'
import { DateTime } from 'luxon'

@inject()
export class TimelineService {
  constructor(protected roundService: RoundService) {}

  async save(adventure: Adventure) {
    const timeline = new Timeline()

    timeline.isActive = false

    const result = await timeline.save()

    result.related('adventure').attach([adventure.id])

    await this.roundService.save(result)

    return result
  }

  async setTimelineActive(timeline: Timeline) {
    const adventure = await timeline.related('adventure').query().first()
    if (!adventure) throw new Error('The timeline do not have any adventure')

    const activeTimelines = await adventure.related('timelines').query().where('isActive', true)

    if (activeTimelines.length) {
      for (const t of activeTimelines) {
        t.isActive = true
        await t.save()
      }
    }

    timeline.isActive = true
    await timeline.save()
  }

  async getTodayRound(timeline: Timeline) {
    const today = DateTime.now().startOf('day').toString()
    return await timeline.related('rounds').query().where('created_at', '>=', today).first()
  }

  async addTodayRound(timeline: Timeline) {
    //TODO : check if round available or streak broke

    return await this.roundService.save(timeline)
  }
}
