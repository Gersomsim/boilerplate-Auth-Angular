import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { ToastrService } from 'ngx-toastr'
import { ForgotPasswordPage } from './forgot-password-page'

describe('ForgotPasswordPage', () => {
	let spectator: SpectatorRouting<ForgotPasswordPage>
	const createComponent = createRoutingFactory({
		component: ForgotPasswordPage,
		providers: [mockProvider(ToastrService)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
