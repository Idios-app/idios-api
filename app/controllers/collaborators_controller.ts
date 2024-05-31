import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CollaboratorService } from '#services/collaborator_service'
import { createCollaboratorValidator, updateCollaboratorValidator } from '#validators/collaborator'
import CollaboratorPolicy from '#policies/collaborator_policy'
import { AccessCodeService } from '#services/access_code_service'

@inject()
export default class CollaboratorsController {
  constructor(
    protected collaboratorService: CollaboratorService,
    protected accessCodeService: AccessCodeService
  ) {}

  async store({ bouncer, request, response, auth }: HttpContext) {
    try {
      const { code } = await request.validateUsing(createCollaboratorValidator)

      const accessCode = await this.accessCodeService.getByCode(code)
      if (!accessCode) return response.notFound('Access Code not found')

      const adventure = await accessCode.related('adventure').query().first()
      if (!adventure) return response.notFound('Adventure not found')

      if (await bouncer.with(CollaboratorPolicy).denies('store', adventure)) {
        return response.forbidden({ error: 'Cannot add a collaborator' })
      }

      return response.send(
        await this.collaboratorService.save({
          adventureId: adventure.id,
          userId: auth.user!.id,
          description: '',
          pseudo: '',
          score: 0,
        })
      )
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to store a collaborator : ' + error.message,
      })
    }
  }

  async show({}: HttpContext) {}

  async update({ bouncer, request, params, response }: HttpContext) {
    try {
      const { pseudo } = await request.validateUsing(updateCollaboratorValidator)

      if (await bouncer.with(CollaboratorPolicy).denies('update', params.id.toString())) {
        return response.forbidden({ error: 'Cannot update a collaborator' })
      }

      return response.send(await this.collaboratorService.update(params.id, pseudo))
    } catch (error) {
      return response.abort({
        error: 'An error occurred while trying to update a collaborator : ' + error.message,
      })
    }
  }

  async destroy({}: HttpContext) {}
}
