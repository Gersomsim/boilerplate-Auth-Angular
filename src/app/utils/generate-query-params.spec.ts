import { generateQueryParams } from './generate-query-params'

describe('GenerateQueryParams', () => {
	it('should generate query params', () => {
		const filters = { page: 1, limit: 10, search: 'test' }
		const queryParams = generateQueryParams(filters)
		expect(queryParams.toString()).toBe('page=1&limit=10&search=test')
	})

	it('should generate query params with undefined values', () => {
		const filters = { page: 1, limit: undefined, search: null }
		const queryParams = generateQueryParams(filters)
		expect(queryParams.toString()).toBe('page=1')
	})

	it('should generate query params with null values', () => {
		const filters = { page: 1, limit: null, search: null }
		const queryParams = generateQueryParams(filters)
		expect(queryParams.toString()).toBe('page=1')
	})

	it('should generate query params with empty object', () => {
		const filters = {}
		const queryParams = generateQueryParams(filters)
		expect(queryParams.toString()).toBe('')
	})
})
