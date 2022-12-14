import * as StatusCodes from "./http.ts";

export class NotFoundException extends Error {
	type: string;
	id: number | string;

	constructor(type: string, id: number | string) {
		super();
		this.type = type;
		this.id = id;

		this.stack = new Error().stack;
	}
}

export class ClientErrorException extends Error {
	failReason: string;
	operation: string;
	statusCode: StatusCodes.ClientErrorCode;

	constructor(
		failReason: string,
		operation: string,
		statusCode: StatusCodes.ClientErrorCode = 401,
	) {
		super();
		this.failReason = failReason;
		this.statusCode = statusCode;
		this.operation = operation;
	}
}

export class ServerErrorException extends Error {
	failReason: string;
	operation: string;
	statusCode: StatusCodes.ServerErrorCode;

	constructor(
		failReason: string,
		operation: string,
		statusCode: StatusCodes.ServerErrorCode = 500,
	) {
		super();
		this.failReason = failReason;
		this.statusCode = statusCode;
		this.operation = operation;
	}
}