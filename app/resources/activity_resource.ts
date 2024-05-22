import { BaseActivityResource } from './base_activity_resource.js'
import Round from '#models/round'
import Features from '../enums/features.js'

export default class ActivityResource extends BaseActivityResource {
  additionalProperties(): {} {
    return {
      test: 'test',
    }
  }

  answerMode(round: Round) {
    for (const item of this.schema) {
      if (Features.hasOwnProperty(item.slice)) {
        console.log(item)
        console.log(round.selectedSubject)
      }
    }
  }
}
