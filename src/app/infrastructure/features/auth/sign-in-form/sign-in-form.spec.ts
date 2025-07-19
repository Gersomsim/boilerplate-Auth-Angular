import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { Notification } from '../../../libraries/notification.library'
import { SignInForm } from './sign-in-form'

describe('SignInForm', () => {
	let spectator: SpectatorRouting<SignInForm>
	const createComponent = createRoutingFactory({
		component: SignInForm,
		providers: [mockProvider(Notification)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
