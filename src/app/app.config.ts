import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'

import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { DI_PROVIDER } from '@infrastructure/di'
import { addTokenInterceptor, launchNotificationInterceptor } from '@infrastructure/interceptors'
import { provideToastr } from 'ngx-toastr'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
	providers: [
		provideToastr(),
		provideAnimations(),
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(),
		provideHttpClient(withInterceptors([addTokenInterceptor, launchNotificationInterceptor])),
		...DI_PROVIDER,
	],
}
