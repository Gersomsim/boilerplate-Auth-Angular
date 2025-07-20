import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

export class CookiesLibrary {
	static get(key: string) {
		return getCookie(key)
	}

	static set(key: string, value: string) {
		setCookie(key, value, { expires: 3 })
	}

	static remove(key: string) {
		removeCookie(key)
	}
}
