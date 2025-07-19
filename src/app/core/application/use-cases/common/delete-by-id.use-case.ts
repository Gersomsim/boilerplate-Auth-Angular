import { BaseRepository } from '@domain/repositories/common/base.repository'

export abstract class DeleteByIdUseCase<T> {
	constructor(private readonly repository: BaseRepository<T>) {}

	execute(id: string): Promise<T> {
		return this.repository.delete(id)
	}
}
