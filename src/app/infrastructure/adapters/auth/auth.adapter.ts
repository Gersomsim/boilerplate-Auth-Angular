import { HttpContext, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Auth, User } from '@domain/models'
import { HttpService } from '@infrastructure/http/http.service'
import { checkToken } from '@infrastructure/interceptors'
import { lastValueFrom } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class AuthAdapter {
	private readonly path = '/auth'
	private readonly http = inject(HttpService)

	login(email: string, password: string): Promise<Auth> {
		const response = this.http.post<Auth>(`${this.path}/login`, {
			email,
			password,
		})
		return lastValueFrom(response)
	}

	register(user: Partial<User>): Promise<Auth> {
		const response = this.http.post<Auth>(`${this.path}/register`, user)
		return lastValueFrom(response)
	}

	forgotPassword(email: string): Promise<void> {
		const response = this.http.post<void>(`${this.path}/forgot-password`, { email })
		return lastValueFrom(response)
	}

	resetPassword(token: string, password: string): Promise<void> {
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
		const response = this.http.postWithHeaders<void>(`${this.path}/reset-password`, { password }, headers)
		return lastValueFrom(response)
	}

	refreshToken(token: string): Promise<Auth> {
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
		const response = this.http.postWithHeaders<Auth>(`${this.path}/refresh-token`, {}, headers)
		return lastValueFrom(response)
	}

	requestVerificationEmail(): Promise<void> {
		const context = checkToken()
		const response = this.http.post<void>(`${this.path}/resend-verification-email`, {}, context)
		return lastValueFrom(response)
	}

	verifyEmail(token: string): Promise<void> {
		const context = new HttpContext()
		const response = this.http.get<void>(`${this.path}/verify-email`, context, { token })
		return lastValueFrom(response)
	}

	verifyToken(token: string): Promise<void> {
		const path = `${this.path}/verify-token/${token}`
		const response = this.http.get<void>(path)
		return lastValueFrom(response)
	}
}
