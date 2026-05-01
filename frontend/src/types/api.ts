export type ApiOk<T> = { ok: true; data: T }
export type ApiErr = { ok: false; message: string; code?: string }
export type ApiResult<T> = ApiOk<T> | ApiErr

