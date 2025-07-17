import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'

import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { DI_PROVIDER } from '@infrastructure/di'
import { addTokenInterceptor, launchNotificationInterceptor } from '@infrastructure/interceptors'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(),
		provideHttpClient(withInterceptors([addTokenInterceptor, launchNotificationInterceptor])),
		...DI_PROVIDER,
	],
}
