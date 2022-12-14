export type QuestionSource = {
    id: string
    name: string
}

export type NewQuestionSource = Omit<QuestionSource, "id">