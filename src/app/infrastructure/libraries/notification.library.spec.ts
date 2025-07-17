import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator/jest'
import { ToastrService } from 'ngx-toastr'
import { Notification } from './notification.library'

describe('NotificationLibrary', () => {
	let spectator: SpectatorService<Notification>
	let toastrService: jest.Mocked<ToastrService>

	const createService = createServiceFactory({
		service: Notification,
		providers: [mockProvider(ToastrService)],
	})

	beforeEach(() => {
		spectator = createService()
		toastrService = spectator.inject(ToastrService) as jest.Mocked<ToastrService>
	})

	describe('Service Creation', () => {
		it('should be created', () => {
			expect(spectator.service).toBeTruthy()
		})
	})

	describe('showSuccess', () => {
		it('should show success notification with default title', () => {
			const message = 'Success message'

			spectator.service.showSuccess(message)

			expect(toastrService.success).toHaveBeenCalledWith(message, '', {
				timeOut: 5000,
				progressBar: true,
			})
		})

		it('should show success notification with custom title', () => {
			const message = 'Success message'
			const title = 'Custom Title'

			spectator.service.showSuccess(message, title)

			expect(toastrService.success).toHaveBeenCalledWith(message, title, {
				timeOut: 5000,
				progressBar: true,
			})
		})
	})

	describe('showError', () => {
		it('should show error notification with default title', () => {
			const message = 'Error message'

			spectator.service.showError(message)

			expect(toastrService.error).toHaveBeenCalledWith(message, '', {
				timeOut: 4000,
				progressBar: true,
			})
		})

		it('should show error notification with custom title', () => {
			const message = 'Error message'
			const title = 'Error Title'

			spectator.service.showError(message, title)

			expect(toastrService.error).toHaveBeenCalledWith(message, title, {
				timeOut: 4000,
				progressBar: true,
			})
		})
	})

	describe('showWarning', () => {
		it('should show warning notification with default title', () => {
			const message = 'Warning message'

			spectator.service.showWarning(message)

			expect(toastrService.warning).toHaveBeenCalledWith(message, '', {
				timeOut: 5000,
				progressBar: true,
			})
		})

		it('should show warning notification with custom title', () => {
			const message = 'Warning message'
			const title = 'Warning Title'

			spectator.service.showWarning(message, title)

			expect(toastrService.warning).toHaveBeenCalledWith(message, title, {
				timeOut: 5000,
				progressBar: true,
			})
		})
	})

	describe('showInfo', () => {
		it('should show info notification with default title', () => {
			const message = 'Info message'

			spectator.service.showInfo(message)

			expect(toastrService.info).toHaveBeenCalledWith(message, '', {
				timeOut: 5000,
				progressBar: true,
			})
		})

		it('should show info notification with custom title', () => {
			const message = 'Info message'
			const title = 'Info Title'

			spectator.service.showInfo(message, title)

			expect(toastrService.info).toHaveBeenCalledWith(message, title, {
				timeOut: 5000,
				progressBar: true,
			})
		})
	})
})
