import { faker } from '@faker-js/faker'
import { User } from './user.model'

export const mockUser = (user?: Partial<User>): User => {
	return {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		roles: [faker.person.jobTitle(), faker.person.jobTitle()],
		...user,
	}
}
