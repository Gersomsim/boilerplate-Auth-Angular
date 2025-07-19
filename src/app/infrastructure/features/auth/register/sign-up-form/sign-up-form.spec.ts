import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { Notification } from '../../../../libraries/notification.library'
import { SignUpForm } from './sign-up-form'

describe('SignUpForm', () => {
	let spectator: SpectatorRouting<SignUpForm>
	const createComponent = createRoutingFactory({
		component: SignUpForm,
		providers: [mockProvider(Notification)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
