import type { HttpContext } from '@adonisjs/core/http'
import { createAdventureValidator } from '#validators/adventure'
import { inject } from '@adonisjs/core'
import { AdventureService } from '#services/adventure_service'
import { CollaboratorService } from '#services/collaborator_service'
import { AccessCodeService } from '#services/access_code_service'
import AdventureResource from '../resources/adventure_resource.js'
import AdventurePolicy from '#policies/adventure_policy'
import { TimelineService } from '#services/timeline_service'

@inject()
export default class AdventuresController {
  constructor(
    protected adventureService: AdventureService,
    protected accessCodeService: AccessCodeService,
    protected collaboratorService: CollaboratorService,
    protected timelineService: TimelineService
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

  async getCurrentActivity({ bouncer, params, response }: HttpContext) {
    try {
      const adventure = await this.adventureService.getById(params.id)

      if (!adventure) throw new Error('Adventure not found')

      if (await bouncer.with(AdventurePolicy).denies('getCurrentActivity', adventure)) {
        return response.forbidden({ error: 'Unauthorized request' })
      }

      let timeline = await this.adventureService.getAdventureTimeline(adventure)

      if (!timeline) {
        timeline = await this.timelineService.save(adventure)
        await this.timelineService.setTimelineActive(timeline)

        //TODO : set current round and activity
      }

      //TODO : continue
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to get the daily activity : ' + error.message,
      })
    }
  }

  async show({}: HttpContext) {}

  async edit({}: HttpContext) {}

  async destroy({}: HttpContext) {}
}
