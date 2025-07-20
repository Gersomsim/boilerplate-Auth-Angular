import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from '@envs/environment'
import { ApiResponse } from '@infrastructure/shared/interfaces/api-response.interface'
import { ErrorHandler } from '@utils/error-handler'
import { generateQueryParams } from '@utils/generate-query-params'
import { catchError, map, Observable } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class HttpService extends ErrorHandler {
	private readonly http = inject(HttpClient)
	baseUrl = environment.apiUrl + '/v1'
	constructor() {
		super(inject(Router))
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get<T>(url: string, context?: HttpContext, filters?: any): Observable<T> {
		const queryParams = generateQueryParams(filters)
		return this.http.get<ApiResponse<T>>(`${this.baseUrl}${url}`, { params: queryParams, context }).pipe(
			map(response => response.data),
			catchError(error => this.handleError(error)),
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	post<T>(url: string, data: any, context?: HttpContext, filters?: any): Observable<T> {
		const queryParams = generateQueryParams(filters)
		return this.http.post<ApiResponse<T>>(`${this.baseUrl}${url}`, data, { params: queryParams, context }).pipe(
			map(response => response.data),
			catchError(error => this.handleError(error)),
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	put<T>(url: string, data: any, context?: HttpContext, filters?: any): Observable<T> {
		const queryParams = generateQueryParams(filters)
		return this.http.put<ApiResponse<T>>(`${this.baseUrl}${url}`, data, { params: queryParams, context }).pipe(
			map(response => response.data),
			catchError(error => this.handleError(error)),
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	patch<T>(url: string, data: any, context?: HttpContext, filters?: any): Observable<T> {
		const queryParams = generateQueryParams(filters)
		return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${url}`, data, { params: queryParams, context }).pipe(
			map(response => response.data),
			catchError(error => this.handleError(error)),
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	delete<T>(url: string, context?: HttpContext, filters?: any): Observable<T> {
		const queryParams = generateQueryParams(filters)
		return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${url}`, { params: queryParams, context }).pipe(
			map(response => response.data),
			catchError(error => this.handleError(error)),
		)
	}

	postWithHeaders<T>(url: string, data: unknown, headers: HttpHeaders): Observable<T> {
		return this.http.post<ApiResponse<T>>(`${this.baseUrl}${url}`, data, { headers }).pipe(
			map(response => response.data),
			catchError(error => this.handleError(error)),
		)
	}
}
