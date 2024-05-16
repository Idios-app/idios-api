import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'
import ActivityResource from '../resources/activity_resource.js'
import Activities from '../enums/activities.js'

@inject()
export default class ActivitiesController {
  constructor(protected activityService: ActivityService) {}
  async show({ response, params }: HttpContext) {
    try {
      const activity = await this.activityService.fetchActivity(
        params.id,
        'populate[activity][populate]=*&populate[recap][populate]=*&populate[vote][populate]=*'
      )
      //return activity.data.attributes.activity
      return new ActivityResource(activity.data, Activities.ACTIVITY)
    } catch (error) {
      return response.status(500).json({ error: 'Error while fetching activity' })
    }
  }
}
