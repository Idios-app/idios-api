import { inject } from '@adonisjs/core'
import StrapiService from '#services/strapi_service'
import Activities from '../enums/activities.js'
import Activity from '#models/activity'

@inject()
export default class ActivityService {
  private readonly strapiBaseUrl: string

  constructor(protected strapiService: StrapiService) {
    this.strapiBaseUrl = 'http://localhost:1337/api/activities'
  }

  async fetchRawProposalSchema(id: string | number) {
    try {
      const url = `${this.strapiBaseUrl}/${id}?populate[${Activities.ACTIVITY}][populate]=*`
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

  async fetchRawActivitySchema(id: string | number) {
    try {
      const url = `${this.strapiBaseUrl}/${id}?populate[${Activities.ACTIVITY}][populate]=*`
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
}
