import { inject } from '@adonisjs/core'
import StrapiService from '#services/strapi_service'
import Activities from '../enums/activities.js'

@inject()
export default class ActivityService {
  private readonly strapiBaseUrl: string

  constructor(protected strapiService: StrapiService) {
    this.strapiBaseUrl = 'http://localhost:1337/api/activities'
  }

  async fetchActivity(id: string) {
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

  async fetchRecap(id: string) {
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

  async fetchVote(id: string) {
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
}
