import { AuthImpRepository } from '@infrastructure/repositories/auth/auth.imp-repository'
import { AuthToken } from './tokens'

export const DI_PROVIDER = [
	{
		provide: AuthToken,
		useClass: AuthImpRepository,
	},
]
