import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { ToastrService } from 'ngx-toastr'
import { SignInPage } from './sign-in-page'

describe('SignInPage', () => {
	let spectator: SpectatorRouting<SignInPage>
	const createComponent = createRoutingFactory({
		component: SignInPage,
		providers: [mockProvider(ToastrService)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
