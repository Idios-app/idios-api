import User from '#models/user'
import { UserInterface } from '../interfaces/user_interface.js'
import UserRegistered from '#events/user_registered'

export default class UserService {
  async store(params: UserInterface) {
    const user = new User()

    user.username = params.username
    user.email = params.email
    user.provider = params.provider
    user.password = params.password
    user.confirmed = params.confirmed
    user.blocked = params.blocked

    await user.save()
    await UserRegistered.dispatch(user)

    return user
  }

  async getCollaboratorProfilesId(user: User) {
    try {
      const profiles = await user.related('collaborators').query().select('id')
      return profiles.map((profile) => profile.id)
    } catch (error) {
      return error.message
    }
  }
}
