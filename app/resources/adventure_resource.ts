import { BaseResource } from './base_resource.js'
import ResourceRelationInterface from '../interfaces/resource_relation_interface.js'
export default class AdventureResource extends BaseResource {
  protected static relations = [
    { name: 'collaborators', collection: true },
    { name: 'owner', collection: false },
    { name: 'code', collection: false },
  ]

  toJson(): {} {
    return {
      id: this.model.id,
      name: this.model.name,
      createdAt: this.model.createdAt,
      updatedAt: this.model.updatedAt,
    }
  }

  protected getRelations(): Array<ResourceRelationInterface> {
    return AdventureResource.relations
  }
}
