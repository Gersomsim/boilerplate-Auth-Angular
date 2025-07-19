import { BaseRepository } from '@domain/repositories/common/base.repository'

export abstract class GetBaseByIdUseCase<T> {
	constructor(private readonly repository: BaseRepository<T>) {}

	execute(id: string): Promise<T> {
		return this.repository.findOneById(id)
	}
}
