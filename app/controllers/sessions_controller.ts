import type { HttpContext } from '@adonisjs/core/http'
import AdventureResource from '../resources/adventure_resource.js'
import Adventure from '#models/adventure'

export default class GameManagersController {
  //TODO : WIP
  async getAllByUserId({ response }: HttpContext) {
    try {
      return await new AdventureResource(await Adventure.findOrFail(1)).withRelationships()
    } catch (error) {
      return response.status(error.status).json({
        error: {
          message: error.message,
        },
      })
    }
  }
}
