import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerPartialValidator } from '#validators/auth'
import logger from '@adonisjs/core/services/logger'
import { randomUUID } from 'node:crypto'
import * as generator from 'generate-password'
import Roles from '../enums/roles.js'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'
import RoleService from '#services/role_service'

@inject()
export default class AuthController {
  constructor(
    protected userService: UserService,
    protected roleService: RoleService
  ) {}
  // async register({ request, response }: HttpContext) {
  //   const payload = await request.validateUsing(registerValidator)
  //
  //   const params = {
  //     ...payload,
  //     roleId: Roles.USER,
  //   }
  //
  //   const user = await User.create(params)
  //
  //   return response.ok(await this.directLogin(user.email, user.password))
  // }

  async registerPartial({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerPartialValidator)

    const params = {
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: `${randomUUID()}@gmail.com`,
      provider: 'local',
      password: generator.generate({
        length: 10,
        numbers: true,
        symbols: true,
        strict: true,
      }),
      confirmed: false,
      blocked: false,
    }

    const user = await this.userService.store(params)

    if (user) await this.roleService.assign(user.id, Roles.GUEST, 1)

    return response.ok(await this.directLogin(params.email, params.password))
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  private async directLogin(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      token: token,
      ...user.serialize(),
    }
  }

  async logout({ auth, response }: HttpContext) {
    logger.info(`User test)`)
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }

  async authenticatedUser({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      return response.ok(user)
    } catch (error) {
      return response.abort({ error: 'User not found' })
    }
  }

  // async assignToken({ params }) {
  //   const user = await User.findOrFail(params.id)
  //   const token = await User.accessTokens.create(user)
  //
  //   return {
  //     type: 'bearer',
  //     value: token.value!.release(),
  //   }
  // }
}
