import Collaborator from '#models/collaborator'
import Adventure from '#models/adventure'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default class CustomVariableReferences {
  static readonly COLLABORATOR = new CustomVariableReferences('COLLABORATOR', Collaborator, false)
  static readonly ADVENTURE = new CustomVariableReferences('ADVENTURE', Adventure, true)

  private constructor(
    private readonly key: string,
    readonly model: ModelObject,
    readonly prefill: boolean
  ) {}

  toString() {
    return this.key
  }
}
