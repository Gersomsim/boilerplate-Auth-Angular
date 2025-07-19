import { BaseRepository } from '@domain/repositories'
import { BaseAdapter } from '@infrastructure/adapters'

export class BaseImpRepository<T> implements BaseRepository<T> {
	constructor(private readonly adapter: BaseAdapter<T>) {}

	findAll(filters?: any): Promise<T[]> {
		return this.adapter.getAll(filters)
	}

	findOneById(id: string): Promise<T> {
		return this.adapter.getById(id)
	}

	create(data: T): Promise<T> {
		return this.adapter.create(data)
	}

	update(id: string, data: T): Promise<T> {
		return this.adapter.update(id, data)
	}

	delete(id: string): Promise<T> {
		return this.adapter.delete(id)
	}
}
