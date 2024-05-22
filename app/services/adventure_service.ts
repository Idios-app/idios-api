import Adventure from '#models/adventure'
import { AdventureInterface } from '../interfaces/adventure_interface.js'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import Collaborator from '#models/collaborator'
import UserService from '#services/user_service'

@inject()
export class AdventureService {
  constructor(protected userService: UserService) {}
  async save(params: AdventureInterface) {
    const adventure = new Adventure()

    adventure.name = params.name
    adventure.streak = params.streak

    const result = await adventure.save()

    await result.related('owner').attach([params.userId])

    return result
  }

  //TODO : refactor using join between adventure, collaborator and user
  async getCollaboratorByUser(adventure: Adventure, user: User): Promise<Collaborator | null> {
    return await adventure
      .related('collaborators')
      .query()
      .where('collaborators.id', user.id)
      .first()
  }

  async getById(id: number) {
    return await Adventure.find(id)
  }

  async getAdventureTimeline(adventure: Adventure) {
    const timelines = await adventure.related('timelines').query()

    if (!timelines.length) {
      return false
    }

    const activeTimeline = timelines.find((timeline) => timeline.isActive)

    if (activeTimeline) {
      return activeTimeline
    }

    return false
  }

  async isAdventureCollaborator(user: User | Collaborator, adventure: Adventure) {
    const adventureCollaborators = await adventure.related('collaborators').query()
    if (user instanceof User) {
      const userCollaborators = await user.related('collaborators').query()
      return userCollaborators.some((userCollaborator) =>
        adventureCollaborators.some(
          (adventureCollaborator) => userCollaborator.id === adventureCollaborator.id
        )
      )
    }

    return adventureCollaborators.some((collaborator) => collaborator.id === user.id)
  }
}
