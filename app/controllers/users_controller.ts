import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({}: HttpContext) {
    return await User.all()
  }
}
