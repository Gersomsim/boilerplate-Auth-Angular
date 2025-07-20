import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { CookiesLibrary } from '../libraries/cookies.library'

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router)
	const token = CookiesLibrary.get('access_token')
	if (!token) {
		const path = route.url[0].path
		if (path === 'app') {
			router.navigate(['/'])
		} else {
			router.navigate(['/'], { queryParams: { redirect: state.url } })
		}
		return false
	}
	return true
}
