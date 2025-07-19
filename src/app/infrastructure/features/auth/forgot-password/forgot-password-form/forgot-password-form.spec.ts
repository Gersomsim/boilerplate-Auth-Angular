import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { Notification } from '../../../../libraries/notification.library'
import { ForgotPasswordForm } from './forgot-password-form'

describe('ForgotPasswordForm', () => {
	let spectator: SpectatorRouting<ForgotPasswordForm>
	const createComponent = createRoutingFactory({
		component: ForgotPasswordForm,
		providers: [mockProvider(Notification)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
