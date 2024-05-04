import Activity from '#models/activity'
import logger from '@adonisjs/core/services/logger'
export default class ActivityService {
  async findById(id: number, populate?: boolean) {
    const activity = await Activity.findOrFail(id)

    if (populate) {
      return await this.populate(activity)
    }

    return activity
  }

  async populate(activity: Activity) {
    logger.debug('populate', activity)
  }
}
