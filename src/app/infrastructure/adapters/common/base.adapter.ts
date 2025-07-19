import { HttpService } from '@infrastructure/http/http.service'
import { lastValueFrom } from 'rxjs'

export abstract class BaseAdapter<T> {
	constructor(
		private readonly http: HttpService,
		private readonly path: string,
	) {}
	getAll(filters?: any): Promise<T[]> {
		const response = this.http.get<T[]>(this.path, filters)
		return lastValueFrom(response)
	}

	getById(id: string): Promise<T> {
		const response = this.http.get<T>(`${this.path}/${id}`)
		return lastValueFrom(response)
	}

	create(data: T): Promise<T> {
		const response = this.http.post<T>(this.path, data)
		return lastValueFrom(response)
	}

	update(id: string, data: T): Promise<T> {
		const response = this.http.put<T>(`${this.path}/${id}`, data)
		return lastValueFrom(response)
	}

	delete(id: string): Promise<T> {
		const response = this.http.delete<T>(`${this.path}/${id}`)
		return lastValueFrom(response)
	}
}
