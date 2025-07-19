import { Routes } from '@angular/router'

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./infrastructure/pages/auth/auth.routes').then(m => m.authRoutes),
	},
]
