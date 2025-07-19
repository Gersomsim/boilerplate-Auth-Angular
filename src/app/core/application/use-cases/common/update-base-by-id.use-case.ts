import { BaseRepository } from '@domain/repositories/common/base.repository'

export abstract class UpdateBaseByIdUseCase<T> {
	constructor(private readonly repository: BaseRepository<T>) {}

	execute(id: string, data: T): Promise<T> {
		return this.repository.update(id, data)
	}
}
