import { Option } from "../../shared/typeTools.ts"
import { QuestionSource } from "../questionSources/types.ts"


export type Question = {
	id: number
	phrasing: string
	source: string
	sourcelink: string
	askdate: Date
	iscanonical: boolean
	answerid?: number
}

// Args required to save a new question.
// As with all other derived types, we construct this by modifying the core Question type to ensure it doesn't drift out of sync
export type NewQuestion = Omit<
	Option<
		Question, "iscanonical"
	>,
	"id" | "askdate" | "source"
> & {sourceid: QuestionSource["id"]}