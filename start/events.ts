import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'
import logger from '@adonisjs/core/services/logger'
const DiscordNewUser = () => import('#listeners/discord_new_user')

emitter.on(UserRegistered, [DiscordNewUser])

emitter.onError((event, error) => {
  logger.warn(`Event error: ${event} : ${error}`)
})
