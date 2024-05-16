import { BaseActivityResource } from './base_activity_resource.js'

export default class ActivityResource extends BaseActivityResource {
  additionalProperties(): {} {
    return {
      test: 'test',
    }
  }
}
