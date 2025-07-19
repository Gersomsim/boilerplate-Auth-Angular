import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest'
import { AuthPage } from './auth-page'

describe('AuthPage', () => {
	let spectator: SpectatorRouting<AuthPage>
	const createComponent = createRoutingFactory(AuthPage)

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
