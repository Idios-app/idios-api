import type { HttpContext } from '@adonisjs/core/http'
import Adventure from '#models/adventure'

export default class DebugsController {
  async try({}: HttpContext) {}

  async getAdventureCollaboratorsDetails({ response }: HttpContext) {
    const adventure = await Adventure.query()
      .where('id', 1)
      .preload('collaborators', (collaboratorsQuery) => {
        collaboratorsQuery.preload('user')
      })
      .preload('owner')
    return response.status(200).json(adventure)
  }
}
