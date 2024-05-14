import AccessCode from '#models/access_code'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Adventure from '#models/adventure'
import { DateTime } from 'luxon'

@inject()
export class AccessCodeService {
  private response
  constructor(protected ctx: HttpContext) {
    this.response = this.ctx.response
  }

  async getByAdventure(adventure: Adventure) {
    try {
      return await adventure
        .related('code')
        .query()
        .select('*')
        .where('expires_at', '>', DateTime.now().toSQLDate())
        .first()
    } catch (error) {
      return this.response.notFound({
        error:
          'An error occurred while trying to retrieve code by adventures id : ' + error.message,
      })
    }
  }

  async getByCode(code: string) {
    try {
      return await AccessCode.findBy('code', code)
    } catch (error) {
      return this.response.notFound({
        error:
          'An error occurred while trying to retrieve theAccessCode by code : ' + error.message,
      })
    }
  }

  async generateAccessCode(adventure: Adventure) {
    const existingCode = await adventure
      .related('code')
      .query()
      .select('id')
      .where('expires_at', '>', DateTime.now().toSQLDate())

    const existingCodeIds = existingCode.map((code) => code.id)

    if (existingCodeIds) {
      await this.delete(adventure.id, existingCodeIds)
    }

    let code: string

    do {
      code = await this.codeGenerator(6)
    } while (await this.getByCode(code))

    return await adventure.related('code').create({
      code: code,
      expiresAt: DateTime.now().plus({ day: 1 }),
    })
  }

  async codeGenerator(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
  }

  async delete(adventureId: number, codeId: number[]) {
    try {
      const adventure = await Adventure.findOrFail(adventureId)

      if (!adventure) new Error('Adventure not found')

      await adventure.related('code').detach(codeId)
      await AccessCode.query().whereIn('id', codeId).delete()
    } catch (error) {
      return this.response.notFound({
        error: 'An error occurred while trying delete AccessCode : ' + error.message,
      })
    }
  }
}
