import { BaseRepository } from '@domain/repositories/common/base.repository'

export abstract class GetAllBaseUseCase<T> {
	constructor(private readonly repository: BaseRepository<T>) {}

	execute(filters: any): Promise<T[]> {
		return this.repository.findAll(filters)
	}
}
