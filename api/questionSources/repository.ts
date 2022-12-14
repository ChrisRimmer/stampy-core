import { db } from "../utils/db.ts";
import { QuestionSource } from "./types.ts";

export const createOne =
    async (questionSource: QuestionSource) =>
    await db.queryObject("INSERT INTO questionsources (name) values ($1)", [questionSource.name])

export const createMany =
	async (questionSources: QuestionSource[]) => {
		for (const questionSource of questionSources) {
			await createOne(questionSource)
		}
	}

export const findByName = async (name: string): Promise<QuestionSource> => {
    return (await db.queryObject<QuestionSource>("SELECT * FROM questionsources WHERE name = $1", [name])).rows[0]
}