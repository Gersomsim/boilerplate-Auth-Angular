import { TestBed } from '@angular/core/testing'
import { HttpInterceptorFn } from '@angular/common/http'

import { launchNotificationInterceptor } from './launch-notification-interceptor'

describe('launchNotificationInterceptor', () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() => launchNotificationInterceptor(req, next))

	beforeEach(() => {
		TestBed.configureTestingModule({})
	})

	it('should be created', () => {
		expect(interceptor).toBeTruthy()
	})
})
