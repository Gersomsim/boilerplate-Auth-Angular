import { faker } from '@faker-js/faker'
import { Auth } from './auth.model'
import { mockUser } from './user.mock'

export const mockAuth = (auth?: Partial<Auth>): Auth => {
	return {
		accessToken: faker.string.uuid(),
		refreshToken: faker.string.uuid(),
		user: mockUser(auth?.user),
		...auth,
	}
}
