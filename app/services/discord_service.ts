import User from '#models/user'

export default class DiscordService {
  async newUser(user: User) {
    console.log('new user created')
  }
}
