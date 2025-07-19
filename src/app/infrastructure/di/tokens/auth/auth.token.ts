import { InjectionToken } from '@angular/core'
import { AuthRepository } from '@domain/repositories'

export const AuthToken = new InjectionToken<AuthRepository>('AuthToken')