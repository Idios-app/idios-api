import Collaborator from '#models/collaborator'
import CollaboratorInterface from '../interfaces/collaborator_interface.js'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export class CollaboratorService {
  protected response

  constructor(protected ctx: HttpContext) {
    this.response = this.ctx.response
  }

  async save(params: CollaboratorInterface) {
    const collaborator = new Collaborator()

    collaborator.pseudo = params.pseudo
    collaborator.score = params.score

    const result = await collaborator.save()

    result.related('adventure').attach([params.adventureId])
    result.related('user').attach([params.userId])

    return result
  }

  async update(id: number, pseudo?: string, description?: string, score?: number) {
    const collaborator = await Collaborator.findOrFail(id)

    if (pseudo && collaborator.pseudo !== pseudo) collaborator.pseudo = pseudo

    if (description && collaborator.description !== description)
      collaborator.description = description

    if (score && collaborator.score !== score) collaborator.score = score

    return await collaborator.save()
  }
}
