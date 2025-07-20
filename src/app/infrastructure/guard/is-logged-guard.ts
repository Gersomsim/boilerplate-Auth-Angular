import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { VerifyTokenUseCase } from '@application/use-cases'
import { CookiesLibrary } from '@infrastructure/libraries/cookies.library'

export const isLoggedGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router)
	const verifyToken = inject(VerifyTokenUseCase)
	const token = CookiesLibrary.get('access_token')
	if (token) {
		try {
			await verifyToken.execute(token)
			router.navigate(['/app'])
			return false
		} catch (error) {
			CookiesLibrary.remove('access_token')
			return true
		}
	}
	return true
}
