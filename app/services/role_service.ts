import Roles from '../enums/roles.js'
import db from '@adonisjs/lucid/services/db'

export default class RoleService {
  async assign(userId: number, role: Roles, userOrder: number) {
    return db.table('up_users_role_links').returning('id').insert({
      user_id: userId,
      role_id: role,
      user_order: userOrder,
    })
  }
}
