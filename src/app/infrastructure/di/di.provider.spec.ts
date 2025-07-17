import { DI_PROVIDER } from './di.provider'

describe('DI Provider', () => {
	it('should be created', () => {
		expect(DI_PROVIDER).toBeDefined()
	})
	it('should return an array', () => {
		expect(Array.isArray(DI_PROVIDER)).toBe(true)
	})
	it('should return an array of providers', () => {
		expect(DI_PROVIDER).toEqual(expect.any(Array))
	})
})
