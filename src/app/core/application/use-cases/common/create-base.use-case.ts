import { BaseRepository } from '@domain/repositories/common/base.repository'

export abstract class CreateBaseUseCase<T> {
	constructor(private readonly repository: BaseRepository<T>) {}

	execute(data: T): Promise<T> {
		return this.repository.create(data)
	}
}
