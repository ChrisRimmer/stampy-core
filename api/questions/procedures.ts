import * as repository from "./repository.ts";
import { Procedure } from "../utils/boundaries.ts";

export const readAll: Procedure = async ({query}) => {
	if (query.pending === "true") {
		return [
			200,
			await repository.readUnapproved()
		]
	} else if (query.pending === "false") {
		return [
			200,
			await repository.readApproved()
		]
	} else {
		return [
			200,
			await repository.readAll()
		]
	}
}