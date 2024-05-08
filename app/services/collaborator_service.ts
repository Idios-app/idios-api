import Collaborator from '#models/collaborator'
import { CollaboratorInterface } from '../interfaces/collaborator_interface.js'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export class CollaboratorService {
  protected response

  constructor(protected ctx: HttpContext) {
    this.response = this.ctx.response
  }

  async all() {}

  async save(params: CollaboratorInterface) {
    const collaborator = new Collaborator()

    // collaborator.adventureId = params.adventureId
    // collaborator.userId = params.userId
    collaborator.score = params.score

    const result = await collaborator.save()

    result.related('adventure').attach([params.adventureId])
    result.related('user').attach([params.userId])

    return result
  }

  async update(params: { id: number; description: string | null; score: number | null }) {
    const collaborator = await Collaborator.findOrFail(params.id)

    if (collaborator.description !== params.description && params.description !== null) {
      collaborator.description = params.description
    }

    if (collaborator.score !== params.score && params.score !== null) {
      collaborator.score = params.score
    }

    return await collaborator.save()
  }
}
