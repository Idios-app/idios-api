import vine from '@vinejs/vine'

/**
 * Validates the collaborator's creation action
 */
export const createCollaboratorValidator = vine.compile(
  vine.object({
    code: vine.string().fixedLength(6).alphaNumeric().escape(),
  })
)

/**
 * Validates the collaborator's update action
 */
export const updateCollaboratorValidator = vine.compile(
  vine.object({
    description: vine.string().escape().minLength(10).maxLength(2000).optional(),
    pseudo: vine.string().minLength(1).maxLength(100).escape().optional(),
    score: vine.number().positive().withoutDecimals().optional(),
  })
)
