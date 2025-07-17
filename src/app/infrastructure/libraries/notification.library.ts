import { inject, Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'

@Injectable({
	providedIn: 'root',
})
export class Notification {
	toast = inject(ToastrService)

	showSuccess(message: string, title = ''): void {
		this.toast.success(message, title, {
			timeOut: 5000,
			progressBar: true,
		})
	}

	showError(message: string, title = ''): void {
		this.toast.error(message, title, {
			timeOut: 4000,
			progressBar: true,
		})
	}

	showWarning(message: string, title = ''): void {
		this.toast.warning(message, title, {
			timeOut: 5000,
			progressBar: true,
		})
	}

	showInfo(message: string, title = ''): void {
		this.toast.info(message, title, {
			timeOut: 5000,
			progressBar: true,
		})
	}
}
