import User from '#models/user'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

export default class DiscordService {
  private webhooks = {
    USER: process.env.DISCORD_USER_WEBHOOK_URL || '',
  }

  async newUser(user: User) {
    try {
      await fetch(this.webhooks.USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: null,
          embeds: [
            {
              title: 'Nouvel utilisateur 🌟',
              description: `__**${user.username}**__ vient de rejoindre IDIOS`,
              color: 51850,
              timestamp: DateTime.now(),
            },
          ],
        }),
      })
    } catch (error) {
      logger.warn(`DiscordService => newUser: ${error.message}`)
    }
  }
}
