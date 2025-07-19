import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest'
import { VerifiedEmailPage } from './verified-email-page'

describe('VerifiedEmailPage', () => {
	let spectator: SpectatorRouting<VerifiedEmailPage>
	const createComponent = createRoutingFactory({
		component: VerifiedEmailPage,
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
