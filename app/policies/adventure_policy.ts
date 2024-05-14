import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class AdventurePolicy extends BasePolicy {
  store(user: User): AuthorizerResponse {
    return !!user
  }
}
