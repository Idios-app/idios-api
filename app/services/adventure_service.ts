import Adventure from '#models/adventure'
import AdventureInterface from '../interfaces/adventure_interface.js'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import Collaborator from '#models/collaborator'
import UserService from '#services/user_service'
import { RoundService } from '#services/round_service'
import db from '@adonisjs/lucid/services/db'

@inject()
export class AdventureService {
  constructor(
    protected userService: UserService,
    protected roundService: RoundService
  ) {}
  async save(params: AdventureInterface) {
    const adventure = new Adventure()

    adventure.name = params.name

    const result = await adventure.save()

    await result.related('owner').attach([params.userId])

    return result
  }

  //TODO : refactor using join between adventure, collaborator and user
  async getCollaboratorByUser(adventure: Adventure, user: User) {
    const collaborators = await adventure.related('collaborators').query()
    const userLinks = await db.from('collaborators_user_links').where('user_id', user.id)

    const userLink = userLinks.find((link) => link.user_id === user.id)

    if (!userLink) return null

    return collaborators.find((c) => c.id === userLink.collaborator_id)
  }

  async getById(id: number) {
    return await Adventure.find(id)
  }

  async getAllByUser(user: User) {
    const collaborators = await user.related('collaborators').query()
    let adventures: Array<Adventure> = []
    for (const collaborator of collaborators) {
      const adventure = await collaborator.related('adventure').query().first()
      if (!adventure) return null
      adventures.push(adventure)
    }
    return adventures
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

  async getAdventureRound(adventure: Adventure) {
    const timeline = await this.getAdventureTimeline(adventure)
    if (!timeline) return null

    const round = await this.roundService.getTodayRound(timeline)
    if (round) return round

    return null
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
