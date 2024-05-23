import { BaseActivityResource } from './base_activity_resource.js'
import Round from '#models/round'
import Contributions from '../enums/contributions.js'

export default class ActivityResource extends BaseActivityResource {
  additionalProperties(): {} {
    return {
      test: 'test',
    }
  }

  //TODO : typesafe ignored, must be improve ASAP
  contributionMode(round: Round) {
    for (const item of this.schema) {
      // @ts-ignore
      if (Contributions.hasOwnProperty(item.slice).valueOf()) {
        // @ts-ignore
        switch (Contributions[item.slice as keyof typeof Contributions]) {
          case 'dialogs':
            // @ts-ignore
            item.sliceData.dialogs.at(-1).text = round.selectedSubject.text
            break
          default:
            throw new Error(
              'contributionMode error : ' +
                // @ts-ignore
                Contributions[item.slice as keyof typeof Contributions][item.slice]
            )
        }
      }
    }

    return this.schema
  }
}
