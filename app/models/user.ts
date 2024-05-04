import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import StrapiNamingStrategy from '../Strategies/StrapiNamingStrategy.js'
import db from '@adonisjs/lucid/services/db'
import Roles from '../enums/roles.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static namingStrategy = new StrapiNamingStrategy()

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare provider: string

  @column()
  declare password: string

  @column()
  declare confirmed: boolean

  @column()
  declare blocked: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  get isAdmin() {
    return new Promise((resolve, reject) => {
      db.from('up_users_role_links')
        .select('role_id')
        .where('user_id', this.id)
        .where('role_id', Roles.ADMIN)
        .first()
        .then((result) => {
          resolve(!!result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
