import { BaseActivityResource } from './base_activity_resource.js'

export default class ActivityResource extends BaseActivityResource {
  toJson(): {} {
    return {
      test: 'test',
    }
  }
}
