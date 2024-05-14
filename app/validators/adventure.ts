import vine from '@vinejs/vine'

/**
 * Validates the adventure's creation action
 */
export const createAdventureValidator = vine.compile(
  vine.object({
    name: vine.string().escape().maxLength(255).minLength(1),
    streak: vine.number().positive().withoutDecimals().optional(),
    pseudo: vine.string().minLength(1).maxLength(100).escape(),
  })
)
