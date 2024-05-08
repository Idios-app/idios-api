import type { HttpContext } from '@adonisjs/core/http'
import { createAdventureValidator } from '#validators/adventure'
import { inject } from '@adonisjs/core'
import { AdventureService } from '#services/adventure_service'
import { CollaboratorService } from '#services/collaborator_service'
import { AccessCodeService } from '#services/access_code_service'

@inject()
export default class AdventuresController {
  constructor(
    protected adventureService: AdventureService,
    protected accessCodeService: AccessCodeService,
    protected collaboratorService: CollaboratorService
  ) {}
  async store({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createAdventureValidator)

      const userId = auth.user?.id
      if (!userId) return response.unauthorized('userId is missing')

      const adventure = await this.adventureService.save({
        userId: userId,
        name: payload.name,
        streak: 0,
      })

      await this.collaboratorService.save({
        adventureId: adventure.id,
        userId: userId,
        description: '',
        score: 0,
      })

      const accessCode = await this.accessCodeService.generateAccessCode(adventure)

      return response.ok({
        success: true,
        adventureId: adventure.id,
        accessCode: accessCode.code,
      })
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to store an adventure : ' + error.message,
      })
    }
  }

  async show({}: HttpContext) {}

  async edit({}: HttpContext) {}

  async destroy({}: HttpContext) {}
}
