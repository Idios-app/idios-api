export default class StrapiService {
  strapiBaseUrl: string
  constructor() {
    if (!process.env.STRAPI_BASE_URL) throw new Error('STRAPI_BASE_URL environment variable')
    this.strapiBaseUrl = process.env.STRAPI_BASE_URL
  }
  async auth() {
    try {
      const response = await fetch(`${this.strapiBaseUrl}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: process.env.STRAPI_USER,
          password: process.env.STRAPI_PASSWORD,
        }),
      })

      const data = await response.json()
      console.log(data)
    } catch (error) {
      return error.message
    }
  }
}
