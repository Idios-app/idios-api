import type { HttpContext } from '@adonisjs/core/http'
import { createAdventureValidator } from '#validators/adventure'
import { inject } from '@adonisjs/core'
import { AdventureService } from '#services/adventure_service'
import { CollaboratorService } from '#services/collaborator_service'
import { AccessCodeService } from '#services/access_code_service'
import AdventureResource from '../resources/adventure_resource.js'
import AdventurePolicy from '#policies/adventure_policy'
import { TimelineService } from '#services/timeline_service'
import ActivityResource from '../resources/activity_resource.js'
import ActivityService from '#services/activity_service'

@inject()
export default class AdventuresController {
  constructor(
    protected adventureService: AdventureService,
    protected accessCodeService: AccessCodeService,
    protected collaboratorService: CollaboratorService,
    protected timelineService: TimelineService,
    protected activityService: ActivityService
  ) {}

  async store({ bouncer, auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createAdventureValidator)

      if (await bouncer.with(AdventurePolicy).denies('store')) {
        return response.forbidden({ error: 'Unauthorized request' })
      }

      const adventure = await this.adventureService.save({
        userId: auth.user!.id,
        name: payload.name,
        streak: 0,
      })

      await this.collaboratorService.save({
        adventureId: adventure.id,
        userId: auth.user!.id,
        description: '',
        pseudo: payload.pseudo ?? '',
        score: 0,
      })

      await this.accessCodeService.generateAccessCode(adventure)

      return response.ok(await new AdventureResource(adventure).withRelationships())
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to store an adventure : ' + error.message,
      })
    }
  }

  async show({}: HttpContext) {}

  async edit({}: HttpContext) {}

  async destroy({}: HttpContext) {}

  async getTodayActivity({ bouncer, params, response }: HttpContext) {
    try {
      const adventure = await this.adventureService.getById(params.id)
      if (!adventure) throw new Error('Adventure not found')

      const isAuthorized = await bouncer
        .with(AdventurePolicy)
        .allows('getCurrentActivity', adventure)
      if (!isAuthorized) return response.forbidden({ error: 'Unauthorized request' })

      let timeline = await this.adventureService.getAdventureTimeline(adventure)
      if (!timeline) {
        timeline = await this.timelineService.save(adventure)
        await this.timelineService.setTimelineActive(timeline)
      }

      let todayRound = await this.timelineService.getTodayRound(timeline)
      if (!todayRound) {
        todayRound = await this.timelineService.addTodayRound(timeline)
      }
      if (!todayRound) throw new Error('Round not found')

      const activity = await todayRound.related('activity').query().first()
      if (!activity) throw new Error('Activity not found')

      const activitySchema = await this.activityService.fetchRawActivitySchema(activity.id)
      const resource = new ActivityResource(activitySchema.data)

      if (!todayRound.selectedSubject) return resource

      return resource.answerMode(todayRound)
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to get the daily activity : ' + error.message,
      })
    }
  }
}
