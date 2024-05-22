import Adventure from '#models/adventure'
import Timeline from '#models/timeline'

export class TimelineService {
  async save(adventure: Adventure) {
    const timeline = new Timeline()

    timeline.isActive = false

    const result = await timeline.save()

    result.related('adventure').attach([adventure.id])

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

  async addNewRound(timeline: Timeline) {
    timeline
  }
}
