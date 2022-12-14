import { Answer, NewAnswer } from "./types.ts";
import { db } from "../utils/db.ts"
import { NotFoundException } from "../utils/exceptions.ts";
import { Tag } from "../tags/types.ts";
import { addQuestionToAnswer } from "../questions/repository.ts";


export const readOne = async (id: Answer['id']): Promise<Answer> => {
	const answer = await db.queryObject<Answer>("SELECT * FROM answers WHERE id = $1", [id])
	if (answer.rows.length === 0) throw new NotFoundException("Answer", id)

	return answer.rows[0]
}

export const readAll = async (): Promise<Answer[]> => {
	return (await db.queryObject<Answer>("SELECT * FROM answers")).rows
}

/**
 * Inserts an answer into the DB and also links any existing tags, questions, and other related questions to it, if they are specified. These other resources MUST already exist
 */
export const createOne = async (answer: NewAnswer): Promise<Answer> => {
	const newAnswer = (await db.queryObject<Answer>("INSERT INTO answers (docurl) VALUES ($1) ON CONFLICT (docurl) DO NOTHING RETURNING *", [answer.docurl])).rows[0]
	if (answer.tags) {
		answer.tags.forEach(tag => addTagToAnswer(tag, newAnswer))
	}
	if (answer.relatedAnswers) {
		// NOTE THE ORDER OF OPERANDS ON THE QUERY HERE
		// Other "add X to Y" queries take X first, this takes Y first
		// because otherwise the handler function gets unintuitive
		answer.relatedAnswers.forEach(relatedAnswer => addRelatedAnswerToAnswer(newAnswer, relatedAnswer))
	}
	if (answer.questions) {
		answer.questions.forEach(question => addQuestionToAnswer(question, newAnswer))
	}

	return newAnswer
}

export const addTagToAnswer = async (tag: Pick<Tag, "id">, answer: Pick<Answer, "id">) => {
	await db.queryObject("INSERT INTO answertags (tagid, answerid) VALUES ($1, $2)", [tag.id, answer.id])
}

/**
 * LOOK OUT FOR THE ORDER OF OPERANDS HERE!
 * Relations are one-way - answer1 leads to answer2, but not back
 */
export const addRelatedAnswerToAnswer = async (answer1: Answer, answer2: Answer) => {
	await db.queryObject("INSERT INTO relatedanswers (answerid1, answerid2) VALUES ($1, $2)", [answer1.id, answer2.id])
}

export const findByDocurl = async (docurl: Answer["docurl"]): Promise<Answer> => {
	return (await db.queryObject<Answer>("SELECT * FROM answers WHERE docurl = $1", [docurl])).rows[0]
}