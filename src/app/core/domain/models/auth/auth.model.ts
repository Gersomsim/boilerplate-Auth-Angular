import { User } from './user.model'

export interface Auth {
	user: User
	accessToken: string
	refreshToken: string
}
