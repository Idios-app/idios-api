import { inject } from '@adonisjs/core'
import StrapiService from '#services/strapi_service'

@inject()
export default class ActivityService {
  private readonly strapiBaseUrl: string

  constructor(protected strapiService: StrapiService) {
    this.strapiBaseUrl = 'http://localhost:1337/api'
  }

  async fetchActivity(id: string, populate: string): Promise<any> {
    try {
      const url = `${this.strapiBaseUrl}/activities/${id}?${populate}`
      const options = {
        method: 'GET',
        headers: {
          'User-Agent': 'insomnia/9.1.0',
          'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }

      const response = await fetch(url, options)
      return await response.json()
    } catch (error) {
      return error.message
    }
  }
}
