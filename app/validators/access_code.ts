import vine from '@vinejs/vine'

/**
 * Validates the access code's creation action
 */
export const createAccessCodeValidator = vine.compile(
  vine.object({
    adventureId: vine.number().positive().withoutDecimals(),
    regen: vine.boolean().optional(),
  })
)
