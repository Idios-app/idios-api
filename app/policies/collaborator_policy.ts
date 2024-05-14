import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { inject } from '@adonisjs/core'
import Adventure from '#models/adventure'

@inject()
export default class CollaboratorPolicy extends BasePolicy {
  async store(user: User, adventure: Adventure) {
    const collaborators = await adventure.related('collaborators').query()
    if (!collaborators) return true

    for (const collaborator of collaborators) {
      const relatedUser = await collaborator.related('user').query().first()
      if (relatedUser!.id === user.id) return false
    }

    return true
  }

  async update(user: User, collaboratorId: string) {
    return !!(await user
      .related('collaborators')
      .query()
      .where('collaborator_id', collaboratorId)
      .first())
  }
}
