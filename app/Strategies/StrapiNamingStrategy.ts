/* eslint-disable unicorn/filename-case */
import { BaseModel, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'

export default class StrapiNamingStrategy extends SnakeCaseNamingStrategy {
  tableName(model: typeof BaseModel) {
    return string.snakeCase('up_' + model.name) + 's'
  }
}
