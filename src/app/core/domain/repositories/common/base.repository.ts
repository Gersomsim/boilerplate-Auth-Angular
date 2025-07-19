export interface BaseRepository<T> {
	findAll(filters: any): Promise<T[]>
	findOneById(id: string): Promise<T>
	create(entity: T): Promise<T>
	update(id: string, entity: T): Promise<T>
	delete(id: string): Promise<T>
}
