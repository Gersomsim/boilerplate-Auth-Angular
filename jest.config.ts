import type { Config } from 'jest'

export default {
	moduleNameMapper: {
		'^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
		'^@infrastructure/(.*)$': '<rootDir>/src/app/infrastructure/$1',
		'^@application/(.*)$': '<rootDir>/src/app/application/$1',
		'^@domain/(.*)$': '<rootDir>/src/app/domain/$1',
		'^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
	},
	coverageDirectory: './coverage',
	collectCoverageFrom: ['src/app/**/*.ts', '!<rootDir/node_modules/', '!<rootDir>/tests/'],
} satisfies Config
