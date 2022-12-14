export type SuccessCode =
	| 200
	| 201
	| 202
	| 203
	| 204
	| 205
	| 206
	| 207
	| 208
	| 226;
export type RedirectionCode =
	| 300
	| 301
	| 302
	| 303
	| 304
	| 305
	| 306
	| 307
	| 308;

export type PermissionError =
	| 401
	| 403;
export type ClientErrorCode =
	| PermissionError
	| 400
	| 402
	| 404
	| 405
	| 406
	| 407
	| 408
	| 409
	| 410
	| 411
	| 412
	| 413
	| 414
	| 415
	| 416
	| 417
	| 418
	| 421
	| 422
	| 423
	| 424
	| 425
	| 426
	| 428
	| 429
	| 431
	| 451;
export type ServerErrorCode =
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505
	| 506
	| 507
	| 508
	| 510
	| 511;
export type HTTPCode =
	| SuccessCode
	| RedirectionCode
	| ClientErrorCode
	| ServerErrorCode;

export const success = (payload: unknown, status: SuccessCode): Response =>
	new Response(JSON.stringify(payload), { status });

// TOOD: Add authentication headers to all sent requests
const request = async (url: string, init: RequestInit) => {
	const headers = { "Content-Type": "application/json", ...init.headers };
	const response = await fetch(url, { ...init, headers });
	if (response.status < 300) {
		try {
			return await response.json();
		} catch {
			try {
				return await response.text();
			} catch (e2) {
				return { error: e2 };
			}
		}
	} else throw response;
};

const qs = (obj = {}) => new URLSearchParams(obj).toString();
export const get = (url: string, body = {}, options = {}) =>
	request(`${url}${body ? `?${qs(body)}` : ""}`, {
		...options,
		method: "GET",
	});
export const post = (url: string, body = {}, options = {}) =>
	request(url, {
		...options,
		body: JSON.stringify(body),
		method: "POST",
	});
export const patch = (url: string, body = {}, options = {}) =>
	request(url, {
		...options,
		body: JSON.stringify(body),
		method: "PATCH",
	});
export const put = (url: string, body = {}, options = {}) =>
	request(url, { ...options, body: JSON.stringify(body), method: "PUT" });
export const del = (url: string, body = {}, options = {}) =>
	request(url, {
		...options,
		body: JSON.stringify(body),
		method: "DELETE",
	});
// TODO: Add PATCH and DELETE handlers
