import ResourceRelationInterface from '../interfaces/resource_relation_interface.js'
import { ModelObject } from '@adonisjs/lucid/types/model'

export abstract class BaseResource {
  protected model: ModelObject
  protected resource: {}
  protected relations: Array<ResourceRelationInterface>

  constructor(model: ModelObject) {
    this.model = model
    this.resource = this.toJson()
    this.relations = this.getRelations()
  }

  abstract toJson(): {}

  protected abstract getRelations(): Array<ResourceRelationInterface>

  async withRelationships(): Promise<{}> {
    for (const relation of this.relations) {
      const result = await this.model.related(relation.name).query()
      this.resource = {
        ...this.resource,
        [relation.name]: relation.collection ? result : result[0],
      }
    }
    return this.resource
  }
}
