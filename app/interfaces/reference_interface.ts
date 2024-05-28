import User from '#models/user'
import Adventure from '#models/adventure'

export default interface ReferenceInterface {
  user: User
  adventure: Adventure
  custom?: object
}
