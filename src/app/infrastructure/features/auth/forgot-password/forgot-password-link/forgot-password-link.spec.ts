import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest'
import { ForgotPasswordLink } from './forgot-password-link'

describe('ForgotPasswordLink', () => {
	let spectator: SpectatorRouting<ForgotPasswordLink>
	const createComponent = createRoutingFactory(ForgotPasswordLink)

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
