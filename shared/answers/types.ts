import { Question } from "../questions/types.ts";
import { Tag } from "../tags/types.ts";

export type Answer = {
	id: number;
	docurl: string;
	questions?: Question[],
	relatedAnswers?: Answer[],
	tags?: Tag[],
}

export type NewAnswer = Omit<Answer, "id">