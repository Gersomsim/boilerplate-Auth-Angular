import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { Notification } from '../../../libraries/notification.library'
import { ResetPasswordForm } from './reset-password-form'

describe('ResetPasswordForm', () => {
	let spectator: SpectatorRouting<ResetPasswordForm>
	const createComponent = createRoutingFactory({
		component: ResetPasswordForm,
		providers: [mockProvider(Notification)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
