import { Routes } from '@angular/router'

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./auth-page/auth-page').then(m => m.AuthPage),
		children: [
			{
				path: 'sign-in',
				loadComponent: () => import('./sign-in-page/sign-in-page').then(m => m.SignInPage),
			},
			{
				path: 'sign-up',
				loadComponent: () => import('./register-page/register-page').then(m => m.RegisterPage),
			},
			{
				path: 'forgot-password',
				loadComponent: () =>
					import('./forgot-password-page/forgot-password-page').then(m => m.ForgotPasswordPage),
			},
			{
				path: 'reset-password',
				loadComponent: () => import('./reset-password-page/reset-password-page').then(m => m.ResetPasswordPage),
			},
			{
				path: '',
				redirectTo: 'sign-in',
				pathMatch: 'full',
			},
		],
	},
	{
		path: 'confirm-email',
		loadComponent: () => import('./verified-email-page/verified-email-page').then(m => m.VerifiedEmailPage),
	},
]
