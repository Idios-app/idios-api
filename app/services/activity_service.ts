import { inject } from '@adonisjs/core'
import StrapiService from '#services/strapi_service'
import Activities from '../enums/activities.js'
import Activity from '#models/activity'
import Round from '#models/round'
import Collaborator from '#models/collaborator'
import ActivityAnswer from '#models/activity_answer'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class ActivityService {
  private readonly strapiBaseUrl: string

  constructor(protected strapiService: StrapiService) {
    this.strapiBaseUrl = 'http://localhost:1337/api/activities'
  }

  async fetchRawProposalSchema(id: string | number) {
    try {
      const url = `${this.strapiBaseUrl}/${id}?populate[${Activities.PROPOSAL}][populate]=*`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }

      const response = await fetch(url, options)
      return await response.json()
    } catch (error) {
      return error.message
    }
  }

  async fetchRawContributionSchema(id: string | number) {
    try {
      const url = `${this.strapiBaseUrl}/${id}?populate[${Activities.CONTRIBUTION}][populate]=*`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }

      const response = await fetch(url, options)
      return await response.json()
    } catch (error) {
      return error.message
    }
  }

  async fetchRawRecapSchema(id: string | number) {
    try {
      const url = `${this.strapiBaseUrl}/${id}?populate[${Activities.RECAP}][populate]=*`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }

      const response = await fetch(url, options)
      return await response.json()
    } catch (error) {
      return error.message
    }
  }

  async fetchRawVoteSchema(id: string | number) {
    try {
      const url = `${this.strapiBaseUrl}/${id}?populate[${Activities.VOTE}][populate]=*`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }

      const response = await fetch(url, options)
      return await response.json()
    } catch (error) {
      return error.message
    }
  }

  async getRandomActivity() {
    try {
      const randomActivity = await Activity.query().orderByRaw('RANDOM()').first()
      if (!randomActivity) throw new Error('Activity is missing')
      return randomActivity
    } catch (error) {
      return error.message
    }
  }

  async saveAnswer(round: Round, collaborator: Collaborator, params: object) {
    const isAvailable = await this.answerAvailability(round, collaborator)
    if (isAvailable !== null) throw new Error(`${collaborator.pseudo} already answered`)

    const answer = new ActivityAnswer()
    answer.content = params
    const result = await answer.save()

    await result.related('round').attach([round.id])
    await result.related('collaborator').attach([collaborator.id])

    return result
  }

  async answerAvailability(round: Round, collaborator: Collaborator) {
    return await db
      .from('activity_answers_collaborator_links as aac')
      .join(
        'activity_answers_round_links as aar',
        'aac.activity_answer_id',
        'aar.activity_answer_id'
      )
      .where('aac.collaborator_id', collaborator.id)
      .where('aar.round_id', round.id)
      .select('aac.id')
      .first()
  }
}
