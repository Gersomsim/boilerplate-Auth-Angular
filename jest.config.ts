import type { Config } from 'jest'

export default {
	moduleNameMapper: {
		'^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
		'^@infrastructure/(.*)$': '<rootDir>/src/app/infrastructure/$1',
		'^@application/(.*)$': '<rootDir>/src/app/core/application/$1',
		'^@domain/(.*)$': '<rootDir>/src/app/core/domain/$1',
		'^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
		'^@envs/(.*)$': '<rootDir>/src/environments/$1',
	},
	coverageDirectory: './coverage',
	collectCoverageFrom: [
		'src/app/**/*.ts',
		'!<rootDir>/node_modules/',
		'!<rootDir>/tests/',
		'!**/index.ts', // Excluye archivos de barril
		'!**/*.spec.ts', // Excluye archivos de test
		'!**/*.test.ts', // Excluye archivos de test
		'!**/app.config.ts', // Excluye archivos de configuración
		'!**/*.routes.ts', // Excluye archivos de rutas
		'!**/main.ts', // Excluye punto de entrada
	],
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	testEnvironment: 'jsdom',
} satisfies Config
