import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest'
import { VerifiedEmail } from './verified-email'

describe('VerifiedEmail', () => {
	let spectator: SpectatorRouting<VerifiedEmail>
	const createComponent = createRoutingFactory(VerifiedEmail)

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
