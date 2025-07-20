import { Route } from '@angular/router'

export const privateRoutes: Route[] = [
	{
		path: '',
		loadComponent: () => import('./main').then(m => m.Main),
	},
]
