import { ModelObject } from '@adonisjs/lucid/types/model'

export abstract class BaseResource {
  protected model: ModelObject
  protected resource: {}
  protected relations: string[] = []

  constructor(model: ModelObject) {
    this.model = model
    this.resource = this.toJson()
  }

  abstract toJson(): {}

  async withRelationships(): Promise<{}> {
    for (const relation of this.relations) {
      const result = await this.model.related(relation).query()
      this.resource = {
        ...this.resource,
        [relation]: result.length > 1 ? result : result[0],
      }
    }
    return this.resource
  }
}
