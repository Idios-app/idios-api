import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'

@inject()
export default class DebugsController {
  constructor(protected activityService: ActivityService) {}

  async try({ response }: HttpContext) {
    try {
      const activity = await this.activityService.fetchActivity(
        2,
        'populate[Before][populate]=*&populate[Feature][populate]=*&populate[After][populate]=*'
      )
      return response.json(activity)
    } catch (error) {
      return response.status(500).json({ error: 'Error while fetching activity' })
    }
  }
}
