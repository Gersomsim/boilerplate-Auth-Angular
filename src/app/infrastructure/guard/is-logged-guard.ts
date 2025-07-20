import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { CookiesLibrary } from '@infrastructure/libraries/cookies.library'
import { JwtLibrary } from '@infrastructure/libraries/jwt.library'

export const isLoggedGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router)
	const token = CookiesLibrary.get('access_token')
	if (token) {
		if (!JwtLibrary.isExpired(token)) {
			router.navigate(['/app'])
			return false
		}
		const refreshToken = CookiesLibrary.get('refresh_token')
		if (refreshToken && !JwtLibrary.isExpired(refreshToken)) {
			router.navigate(['/app'])
			return false
		}
	}
	return true
}
