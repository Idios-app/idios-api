export default interface UserInterface {
  id?: number
  username: string
  email: string
  provider: string
  password: string
  confirmed: boolean
  blocked: boolean
}
