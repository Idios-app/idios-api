import User from '#models/user'
import { inject } from '@adonisjs/core'
import DiscordService from '#services/discord_service'
import logger from '@adonisjs/core/services/logger'

@inject()
//TODO : change class name
export default class SendVerificationEmail {
  constructor(protected discordService: DiscordService) {}
  handle(user: User) {
    this.discordService.newUser(user).then(() => {
      logger.info(`New User : ${user.id}`)
    })
  }
}
