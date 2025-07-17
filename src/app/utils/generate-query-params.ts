import { HttpParams } from '@angular/common/http'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateQueryParams = (filters: any): HttpParams => {
	if (!filters) return new HttpParams()
	let params = new HttpParams()
	for (const key in filters) {
		if (filters[key] !== undefined && filters[key] !== null) {
			params = params.set(key, filters[key])
		}
	}
	return params
}
