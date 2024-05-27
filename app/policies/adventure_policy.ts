import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Adventure from '#models/adventure'
import { inject } from '@adonisjs/core'
import { AdventureService } from '#services/adventure_service'

@inject()
export default class AdventurePolicy extends BasePolicy {
  constructor(protected adventureService: AdventureService) {
    super()
  }
  store(user: User): AuthorizerResponse {
    return !!user
  }

  collaboratorAction(user: User, adventure: Adventure): AuthorizerResponse {
    return this.adventureService.isAdventureCollaborator(user, adventure)
  }
}
