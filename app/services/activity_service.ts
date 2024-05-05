export default class ActivityService {
  private readonly strapiBaseUrl: string

  constructor() {
    this.strapiBaseUrl = 'http://localhost:1337/api'
  }

  async fetchActivity(id: number, populate: string): Promise<any> {
    try {
      const url = `${this.strapiBaseUrl}/activities/${id}?${populate}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error while fetching activity from Strapi: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error while fetching activity from Strapi: ${error.message}`)
      throw error
    }
  }
}
