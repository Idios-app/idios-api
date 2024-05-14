import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { AccessCodeService } from '#services/access_code_service'
import { AdventureService } from '#services/adventure_service'
import { createAccessCodeValidator } from '#validators/access_code'

@inject()
export default class AccessCodesController {
  constructor(
    protected accessCodeService: AccessCodeService,
    protected adventureService: AdventureService
  ) {}

  async store({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(createAccessCodeValidator)

      const adventure = await this.adventureService.getById(payload.adventureId)
      if (!adventure) throw new Error('Adventure not found')

      if (
        auth.user
        //TODO : check if user is collaborator of the adventure
        // (await this.adventureService.getCollaboratorByUser(adventure, auth.user!)) === null
      )
        if (adventure.$getRelated('code') && !payload.regen)
          throw new Error(
            'Access code already exists. Use "regen" attribute to force regeneration.'
          )

      return this.accessCodeService.generateAccessCode(adventure)
    } catch (error) {
      return response.notFound({
        error: 'An error occurred while trying to generate AccessCode: ' + error.message,
      })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      if (!auth.user) throw new Error('User not found')

      const adventure = await this.adventureService.getById(params.id)
      if (!adventure) throw new Error('Adventure not found')

      //TODO : check if user is collaborator of the adventure
      // const collaborator = await this.adventureService.getCollaboratorByUser(adventure, auth.user)
      // if (!collaborator) throw new Error('You are not related to this adventure')

      return this.accessCodeService.getByAdventure(adventure)
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to get an access code : ' + error.message,
      })
    }
  }
}
