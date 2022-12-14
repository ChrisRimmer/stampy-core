import { Answer } from "../answers/types.ts";
import { db } from "../utils/db.ts";
import { NewQuestion, Question } from "./types.ts";
import * as qsRepo from "../questionSources/repository.ts"

export const readOne = async (id: Question["id"]): Promise<Question> => {
	return (await db.queryObject<Question>("SELECT * from questions WHERE id = $1", [id])).rows[0]
}

export const readAll = async (): Promise<Question[]> => {
	return (await db.queryObject<Question>("SELECT * from questions")).rows
}

export const readApproved = async (): Promise<Question[]> => {
	return (await db.queryObject<Question>("SELECT * from questions WHERE answerid IS NOT NULL")).rows
}

export const readUnapproved = async (): Promise<Question[]> => {
	return (await db.queryObject<Question>("SELECT * from questions WHERE answerid IS NULL")).rows
}

export const findByText = async (text: Question["phrasing"]) => {
	return (await db.queryObject<Question>("SELECT * FROM questions WHERE phrasing = $1", [text])).rows[0]
}

export const createOne = async (question: NewQuestion): Promise<Question> => {
	const fields = Object.keys(question).join(", ")
	const values = Object.values(question)
	const valuePlaceholders = Object.keys(question).map((_, i) => `$${i+1}`).join(", ")
	console.log(fields, values)
	return (await (db.queryObject<Question>(`INSERT INTO questions (${fields}) VALUES (${valuePlaceholders}) RETURNING *`, values))).rows[0]
}

export const addQuestionToAnswer = async (question: Question, answer: Answer) => {
	await db.queryObject("UPDATE questions SET answerid = $1 WHERE id = $2", [answer.id, question.id])
}