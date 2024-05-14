import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().escape(),
    password: vine.string().minLength(8).maxLength(32).escape(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(1).maxLength(64).escape(),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      })
      .escape(),
    password: vine.string().minLength(8).maxLength(32).escape(),
  })
)

export const registerPartialValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(1).maxLength(100).escape(),
  })
)
