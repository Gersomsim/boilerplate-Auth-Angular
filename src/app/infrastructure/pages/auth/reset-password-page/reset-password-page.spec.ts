import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { ResetPasswordPage } from './reset-password-page'
import { ToastrService } from 'ngx-toastr'

describe('ResetPasswordPage', () => {
	let spectator: SpectatorRouting<ResetPasswordPage>
	const createComponent = createRoutingFactory({
		component: ResetPasswordPage,
		providers: [mockProvider(ToastrService)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
