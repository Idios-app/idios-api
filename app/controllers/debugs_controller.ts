import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'

@inject()
export default class DebugsController {
  constructor(protected activityService: ActivityService) {}
  async try({}: HttpContext) {
    //await this.activityService.findById(1)
  }
}
