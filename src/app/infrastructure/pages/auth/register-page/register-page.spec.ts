import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator/jest'
import { RegisterPage } from './register-page'
import { ToastrService } from 'ngx-toastr'

describe('RegisterPage', () => {
	let spectator: SpectatorRouting<RegisterPage>
	const createComponent = createRoutingFactory({
		component: RegisterPage,
		providers: [mockProvider(ToastrService)],
	})

	beforeEach(async () => {
		spectator = createComponent()
	})

	it('should create', () => {
		expect(spectator.component).toBeTruthy()
	})
})
