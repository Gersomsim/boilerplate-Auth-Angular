import { jwtDecode, JwtPayload } from 'jwt-decode'

export class JwtLibrary {
	static isExpired(token: string): boolean {
		try {
			const decodedToken: JwtPayload = jwtDecode(token)
			if (decodedToken.exp) {
				return Date.now() >= decodedToken.exp * 1000
			}
			return false
		} catch (error) {
			console.error('Error decoding token:', error)
			return true
		}
	}
}
