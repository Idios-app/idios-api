import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'
import logger from '@adonisjs/core/services/logger'
const SendVerificationEmail = () => import('#listeners/send_verification_email')

emitter.on(UserRegistered, [SendVerificationEmail])

emitter.onError((event, error) => {
  logger.warn(`Event error: ${event} : ${error}`)
})
