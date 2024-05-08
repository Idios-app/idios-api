import Adventure from '#models/adventure'
import { AdventureInterface } from '../interfaces/adventure_interface.js'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

enum AdventureRelationshipType {
  user = 'user',
  code = 'code',
  collaborators = 'collaborators',
}
@inject()
export class AdventureService {
  protected response
  protected AdventureRelationshipTypeKey: keyof typeof AdventureRelationshipType

  constructor(protected ctx: HttpContext) {
    this.response = this.ctx.response
    this.AdventureRelationshipTypeKey = Object.keys(
      AdventureRelationshipType
    ) as unknown as keyof typeof AdventureRelationshipType
  }

  async all() {
    try {
      return await Adventure.all()
    } catch (error) {
      return this.response.notFound({
        error: 'An error occurred while trying to retrieve all adventures : ' + error.message,
      })
    }
  }

  // async getById(id: number, preload?: string[]) {
  //   try {
  //     const relationships = Adventure.$relationsDefinitions
  //     let query = Adventure.query().where('id', id)
  //     if (preload) {
  //       preload.forEach((p) => {
  //         if (relationships.has(p)) {
  //           const keys = Object.keys(AdventureRelationshipType) as AdventureRelationshipType[]
  //           query = query.preload(keys.find((element) => element === p))
  //         }
  //       })
  //     }
  //
  //     return await query.first()
  //   } catch (error) {
  //     return this.response.notFound({
  //       error: 'An error occurred while trying to retrieve the adventure by ID : ' + error.message,
  //     })
  //   }
  // }
  //
  // async getByUserId(userId: number, preload?: string[]) {
  //   try {
  //     const relationships = Adventure.$relationsDefinitions
  //     let query = Adventure.query().where('user_id', userId)
  //     if (preload) {
  //       preload.forEach((p) => {
  //         if (relationships.has(p)) {
  //           const keys = Object.keys(AdventureRelationshipType) as AdventureRelationshipType[]
  //           query = query.preload(keys.find((element) => element === p))
  //         }
  //       })
  //     }
  //
  //     return await query
  //   } catch (error) {
  //     return this.response.notFound({
  //       error:
  //         'An error occurred while trying to retrieve the adventure by userId : ' + error.message,
  //     })
  //   }
  // }

  async save(params: AdventureInterface) {
    const adventure = new Adventure()

    adventure.name = params.name
    adventure.streak = params.streak

    const result = await adventure.save()

    await result.related('owner').attach([params.userId])

    return result
  }
}
