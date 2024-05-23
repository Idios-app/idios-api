import { BaseResource } from './base_resource.js'

export default class AdventureResource extends BaseResource {
  protected relations = ['collaborators', 'owner', 'code']

  toJson(): {} {
    return {
      id: this.model.id,
      name: this.model.name,
      createdAt: this.model.createdAt,
      updatedAt: this.model.updatedAt,
    }
  }
}
