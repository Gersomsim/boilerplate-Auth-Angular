import { HttpContext, HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthAdapter } from '@infrastructure/adapters/auth/auth.adapter'
import { CookiesLibrary } from '@infrastructure/libraries/cookies.library'
import { JwtLibrary } from '@infrastructure/libraries/jwt.library'

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false)

export function checkToken() {
	return new HttpContext().set(CHECK_TOKEN, true)
}

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.context.get(CHECK_TOKEN)) {
		const token = CookiesLibrary.get('access_token')
		if (token) {
			if (JwtLibrary.isExpired(token)) {
				refreshToken(req, next)
			} else {
				return addToken(req, next)
			}
		}
	}
	return next(req)
}

function addToken(req: HttpRequest<any>, next: HttpHandlerFn) {
	const token = CookiesLibrary.get('access_token')
	if (token) {
		const newReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		})
		return next(newReq)
	}
	return next(req)
}

async function refreshToken(req: HttpRequest<any>, next: HttpHandlerFn) {
	const token = CookiesLibrary.get('refresh_token')
	const adapter = inject(AuthAdapter)
	if (token && !JwtLibrary.isExpired(token)) {
		const auth = await adapter.refreshToken(token)
		CookiesLibrary.set('access_token', auth.accessToken)
		CookiesLibrary.set('refresh_token', auth.refreshToken)
		return addToken(req, next)
	}
	return next(req)
}
