import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest'
import { RegisterLink } from './register-link'

describe('RegisterLink', () => {
	let spectator: SpectatorRouting<RegisterLink>
	const createComponent = createRoutingFactory(RegisterLink)

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
