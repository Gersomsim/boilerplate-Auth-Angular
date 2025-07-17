import { HttpContext, HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false)

export function checkToken() {
	return new HttpContext().set(CHECK_TOKEN, true)
}

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.context.get(CHECK_TOKEN)) {
		return addToken(req, next)
	}
	return next(req)
}

function addToken(req: HttpRequest<any>, next: HttpHandlerFn) {
	const token = localStorage.getItem('token')
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
