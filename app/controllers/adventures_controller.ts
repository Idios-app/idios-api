import type { HttpContext } from '@adonisjs/core/http'
import {
  contributionAdventureValidator,
  createAdventureValidator,
  proposalAdventureValidator,
} from '#validators/adventure'
import { inject } from '@adonisjs/core'
import { AdventureService } from '#services/adventure_service'
import { CollaboratorService } from '#services/collaborator_service'
import { AccessCodeService } from '#services/access_code_service'
import AdventureResource from '../resources/adventure_resource.js'
import AdventurePolicy from '#policies/adventure_policy'
import { TimelineService } from '#services/timeline_service'
import ActivityResource from '../resources/activity_resource.js'
import ActivityService from '#services/activity_service'
import { RoundService } from '#services/round_service'

@inject()
export default class AdventuresController {
  constructor(
    protected adventureService: AdventureService,
    protected accessCodeService: AccessCodeService,
    protected collaboratorService: CollaboratorService,
    protected timelineService: TimelineService,
    protected activityService: ActivityService,
    protected roundService: RoundService
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

  async getTodayActivity({ bouncer, params, auth, response }: HttpContext) {
    try {
      const adventure = await this.adventureService.getById(params.id)
      if (!adventure) throw new Error('Adventure not found')

      const isAuthorized = await bouncer
        .with(AdventurePolicy)
        .allows('collaboratorAction', adventure)
      if (!isAuthorized) return response.forbidden({ error: 'Unauthorized request' })

      let timeline = await this.adventureService.getAdventureTimeline(adventure)
      if (!timeline) {
        timeline = await this.timelineService.save(adventure)
        await this.timelineService.setTimelineActive(timeline)
      }

      let todayRound = await this.roundService.getTodayRound(timeline)
      if (!todayRound) {
        todayRound = await this.roundService.addTodayRound(timeline)
      }
      if (!todayRound) throw new Error('Round not found')

      const activity = await todayRound.related('activity').query().first()
      if (!activity) throw new Error('Activity not found')

      if (!todayRound.selectedSubject) {
        const activitySchema = await this.activityService.fetchRawProposalSchema(activity.id)
        const resource = new ActivityResource(activitySchema.data, {
          user: auth.user!,
          adventure: adventure,
        })
        return await resource.init()
      }

      const activitySchema = await this.activityService.fetchRawContributionSchema(activity.id)

      const resource = new ActivityResource(activitySchema.data)
      await resource.init()
      return resource.contributionMode(todayRound)
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to get the daily activity : ' + error.message,
      })
    }
  }

  async proposalAnswer({ bouncer, params, auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(proposalAdventureValidator)

      const adventure = await this.adventureService.getById(params.id)
      if (!adventure) throw new Error('Adventure not found')

      const isAuthorized = await bouncer
        .with(AdventurePolicy)
        .allows('collaboratorAction', adventure)
      if (!isAuthorized) return response.forbidden({ error: 'Unauthorized request' })

      const round = await this.adventureService.getAdventureRound(adventure)
      if (!round) throw new Error('Round not found')
      if (round.selectedSubject !== null) throw new Error('Round subject already exists')

      const collaborator = await this.adventureService.getCollaboratorByUser(adventure, auth.user!)
      if (!collaborator) throw new Error('Collaborator not found')

      return await this.roundService.updateRoundSubject(round, {
        ...payload,
        collaboratorId: collaborator.id,
      })
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to answer proposal : ' + error.message,
      })
    }
  }

  async contributionAnswer({ bouncer, params, auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(contributionAdventureValidator)

      const adventure = await this.adventureService.getById(params.id)
      if (!adventure) throw new Error('Adventure not found')

      const isAuthorized = await bouncer
        .with(AdventurePolicy)
        .allows('collaboratorAction', adventure)
      if (!isAuthorized) return response.forbidden({ error: 'Unauthorized request' })

      const round = await this.adventureService.getAdventureRound(adventure)
      if (!round) throw new Error('Round not found')

      const collaborator = await this.adventureService.getCollaboratorByUser(adventure, auth.user!)
      if (!collaborator) throw new Error('Collaborator not found')

      return await this.activityService.saveAnswer(round, collaborator, payload)
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to answer contribution : ' + error.message,
      })
    }
  }
}
