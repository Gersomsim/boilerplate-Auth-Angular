import { User } from './user.model'

export interface Auth extends User {
	token: string
	refreshToken: string
}
