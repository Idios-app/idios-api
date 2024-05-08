import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'
import Adventure from '#models/adventure'

@inject()
export default class DebugsController {
  constructor(protected activityService: ActivityService) {}

  async try({}: HttpContext) {}

  //TODO : must be destroy
  async getActivityById({ response, request }: HttpContext) {
    try {
      let id = '' + request.only(['id'])
      const activity = await this.activityService.fetchActivity(
        id,
        'populate[before][populate]=*&populate[feature][populate]=*&populate[after][populate]=*'
      )
      return response.json(activity)
    } catch (error) {
      return response.status(500).json({ error: 'Error while fetching activity' })
    }
  }

  async getAdventureCollaboratorsDetails({ response }: HttpContext) {
    const adventure = await Adventure.query()
      .where('id', 1)
      .preload('collaborators', (collaboratorsQuery) => {
        collaboratorsQuery.preload('user')
      })
      .preload('owner')
    return response.status(200).json(adventure)
  }
}
