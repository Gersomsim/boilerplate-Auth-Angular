export interface ApiResponse<T> {
	success: boolean
	message: string
	data: T
	meta: Meta
}

export interface Meta {
	timestamp: Date
	requestId: string
	path: string
}
