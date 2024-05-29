import Sentry from '#start/sentry'

export default class SentryMiddleware {
  async handle(next: () => Promise<void>) {
    try {
      await next()
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
