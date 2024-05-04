import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import logger from '@adonisjs/core/services/logger'

export default class AdminMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })

    if (ctx.auth.user && (await ctx.auth.user.isAdmin)) {
      return next()
    }

    logger.warn(
      ctx.auth.user
        ? ctx.auth.user.username + ` (id : ${ctx.auth.user.id}) tried to access admin route`
        : 'Unregistered user tried to access admin route'
    )
    ctx.response.abort(
      {
        errors: {
          message: 'Unauthorized request',
          admin: `I see you ${ctx.auth.user ? ctx.auth.user.username : ''} 🥸`,
        },
      },
      403
    )
  }
}
