export interface UserInterface {
  id?: number
  username: string
  firstName: string
  lastName: string
  email: string
  provider: string
  password: string
  confirmed: boolean
  blocked: boolean
}
