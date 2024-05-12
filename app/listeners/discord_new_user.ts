import { inject } from '@adonisjs/core'
import DiscordService from '#services/discord_service'
import logger from '@adonisjs/core/services/logger'
import UserRegistered from '#events/user_registered'

@inject()
export default class DiscordNewUser {
  constructor(protected discordService: DiscordService) {}
  handle(data: UserRegistered) {
    this.discordService.newUser(data.user).then(() => {
      logger.info(`New User: ${data.user.username}, ID: ${data.user.id}`)
    })
  }
}
