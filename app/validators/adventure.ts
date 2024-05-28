import vine from '@vinejs/vine'

/**
 * Validates the adventure's creation action
 */
export const createAdventureValidator = vine.compile(
  vine.object({
    name: vine.string().escape().maxLength(255).minLength(1),
    pseudo: vine.string().minLength(1).maxLength(100).escape(),
  })
)

/**
 * Validates the adventure's proposal action
 */
export const proposalAdventureValidator = vine.compile(
  vine.object({
    id: vine.number().positive().withoutDecimals().optional(),
    text: vine.string().minLength(1).maxLength(255).optional(), //TODO : MUST BE ESCAPE WHEN IT WILL BE POSSIBLE
    //ADD MORE POSSIBLE ANSWERS
  })
)

/**
 * Validates the adventure's contribution action
 */
export const contributionAdventureValidator = vine.compile(
  vine.object({
    text: vine.string().minLength(1).maxLength(255).optional(), //TODO : MUST BE ESCAPE WHEN IT WILL BE POSSIBLE
    //ADD MORE POSSIBLE ANSWERS
  })
)
