import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'
import ActivityResource from '../resources/activity_resource.js'

@inject()
export default class ActivitiesController {
  constructor(protected activityService: ActivityService) {}
  async show({ response, params }: HttpContext) {
    try {
      const activity = await this.activityService.fetchRawProposalSchema(params.id)
      return new ActivityResource(activity.data)
    } catch (error) {
      return response.status(500).json({ error: 'Error while fetching activity' })
    }
  }

  async showRecap({ response, params }: HttpContext) {
    try {
      const activity = await this.activityService.fetchRawRecapSchema(params.id)
      return new ActivityResource(activity.data)
    } catch (error) {
      return response.status(500).json({ error: 'Error while fetching activity recap' })
    }
  }

  async showVote({ response, params }: HttpContext) {
    try {
      const activity = await this.activityService.fetchRawVoteSchema(params.id)
      return new ActivityResource(activity.data)
    } catch (error) {
      return response.status(500).json({ error: 'Error while fetching activity vote' })
    }
  }
}
