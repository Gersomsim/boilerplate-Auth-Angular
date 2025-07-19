export abstract class BaseStore<T> {
	setAll(data: T[]) {}

	setOne(data: T) {}

	setLoading(loading: boolean) {}
}
