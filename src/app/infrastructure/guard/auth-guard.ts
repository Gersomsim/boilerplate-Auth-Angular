import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { JwtLibrary } from '@infrastructure/libraries/jwt.library'
import { CookiesLibrary } from '../libraries/cookies.library'

export const authGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router)

	const token = CookiesLibrary.get('access_token')
	if (token) {
		if (!JwtLibrary.isExpired(token)) {
			return true
		}
		const refreshToken = CookiesLibrary.get('refresh_token')
		if (refreshToken && !JwtLibrary.isExpired(refreshToken)) {
			return true
		} else {
			CookiesLibrary.remove('access_token')
			CookiesLibrary.remove('refresh_token')
			router.navigate(['/'])
			return false
		}
	}
	const path = route.url[0].path
	if (path === 'app') {
		router.navigate(['/'])
	} else {
		router.navigate(['/'], { queryParams: { redirect: state.url } })
	}
	return false
}
