import {
	CreateBaseUseCase,
	DeleteByIdUseCase,
	GetAllBaseUseCase,
	GetBaseByIdUseCase,
	UpdateBaseByIdUseCase,
} from '@application/use-cases'
import { BaseStore } from '@infrastructure/states/store/common/base.store'

export abstract class BaseFacade<T> {
	constructor(
		private readonly store: BaseStore<T>,
		private readonly getAllUseCase: GetAllBaseUseCase<T>,
		private readonly getOneByIdUseCase: GetBaseByIdUseCase<T>,
		private readonly createUseCase: CreateBaseUseCase<T>,
		private readonly updateUseCase: UpdateBaseByIdUseCase<T>,
		private readonly deleteUseCase: DeleteByIdUseCase<T>,
	) {}

	async loadAll(filters: any): Promise<T[]> {
		this.store.setLoading(true)
		const data = await this.getAllUseCase.execute(filters)
		this.store.setAll(data)
		this.store.setLoading(false)
		return data
	}

	async loadOneById(id: string): Promise<T> {
		this.store.setLoading(true)
		const data = await this.getOneByIdUseCase.execute(id)
		this.store.setOne(data)
		this.store.setLoading(false)
		return data
	}

	async create(data: T): Promise<T> {
		this.store.setLoading(true)
		const newData = await this.createUseCase.execute(data)
		this.store.setLoading(false)
		return newData
	}

	async update(id: string, data: T): Promise<T> {
		this.store.setLoading(true)
		const updatedData = await this.updateUseCase.execute(id, data)
		this.store.setLoading(false)
		return updatedData
	}

	async delete(id: string): Promise<T> {
		this.store.setLoading(true)
		const deletedData = await this.deleteUseCase.execute(id)
		this.store.setLoading(false)
		return deletedData
	}
}
