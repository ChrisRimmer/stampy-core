import "./env.ts";
import _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js"

import * as aRepo from "./api/answers/repository.ts"
import * as qRepo from "./api/questions/repository.ts"
import * as qsRepo from "./api/questionSources/repository.ts"
import * as tRepo from "./api/tags/repository.ts"
import { PostgresError } from "https://deno.land/x/postgres@v0.17.0/client/error.ts";
import { db } from "./api/utils/db.ts";
import { Tag } from "./api/tags/types.ts";



const ignoreDBError = async cb => {
    try  {
        return await cb()
    } catch (e) {
        if (e instanceof PostgresError) {
            // pass
        } else throw e
    }
}

const waitForJson = async (url: string|URL|Request) => await (await fetch(url)).json()

const questionsurl = "https://stampy.ai/w/api.php?action=ask&format=json&query=%5B%5BCategory%3AQuestions%5D%5D%5B%5BOrigin%3A%3A!YouTube%5D%5D%7C%3FAnsweredBy%7C%3FAlternatePhrasing%7C%3FTags%7C%3FPageID%7C%3FOrigin%7C%3FDuplicateOf%7C%3FAskDate%7Climit%3D50000"
const questions = Object.values((await waitForJson(questionsurl)).query.results)

const answersurl = "https://stampy.ai/w/api.php?action=ask&format=json&query=%5B%5BCategory%3AAnswers%5D%5D%5B%5BOrigin%3A%3A!YouTube%5D%5D%7C%3FAnswerTo%7C%3FTags%7C%3FCanonical%7Climit%3D50000"
const answers = Object.values((await waitForJson(answersurl)).query.results).filter(a => questions.filter(q => q.printouts.AnsweredBy.length == 1).map(q => q.printouts.AnsweredBy[0].fulltext).includes(a.fulltext))

const parseQuestion = ({
    fulltext: phrasing,
    fullurl: sourcelink,
    printouts: {AskDate: [{timestamp: askdate}], Origin: [source], Tags: tags, AnsweredBy: answers}
}) => ({
    phrasing,
    sourcelink,
    askdate,
    source,
    ...(answers.length === 1 ? {answer: answers[0].fullurl} : {})
})

// const currentState =

const parsedQuestions = questions.map(parseQuestion)

const questionTags = parsedQuestions.map(({tags}) => tags).flat()
const answerTags = answers.map(answer => answer.printouts.Tags).flat().map(({fulltext}) => fulltext)

const allTags = _.uniq([...questionTags, ...answerTags])
const allOrigins = _.uniq(parsedQuestions.map(({source}) => source))

const existingTags = (await db.queryObject("select name from tags")).rows.map(({name}) => name)
const existingOrigins = (await db.queryObject("select name from questionsources")).rows.map(({name}) => name)

const missingTags = allTags.filter(tag => !existingTags.includes(tag))
const missingOrigins = allOrigins.filter(origin => !existingOrigins.includes(origin))

console.info("Syncing missing tags:", missingTags)
for (const tag of missingTags) {
    await ignoreDBError(async () => await tRepo.createOne({name: tag}))
}

console.info("Syncing missing question sources:", missingOrigins)
for (const origin of missingOrigins) {
    await ignoreDBError(async () => await qsRepo.createOne({name: origin}))
}

for (const question of parsedQuestions) {
    const { id: sourceid } = await qsRepo.findByName(question.source)
    const answer = question.answer ? {
        answerid: (
            await aRepo.findByDocurl(question.answer) ||
            await ignoreDBError(async() => await aRepo.createOne({docurl: question.answer}))
        ).id
    } : {}

    const alreadyExists = await qRepo.findByText(question.phrasing)
    console.info("Importing", question)
    if (alreadyExists) {
        if (alreadyExists.questionid === null && JSON.stringify(answer) !== JSON.stringify({})) {
            console.info("Question needs updating to add answer", answer, "to it")
            await qRepo.addQuestionToAnswer(alreadyExists, {id: answer.answerid})
        }
    } else {
        console.info("Question needs creating")

        await qRepo.createOne({
            phrasing: question.phrasing,
            sourcelink: question.sourcelink,
            sourceid,
            ...answer
        })
    }
}

console.info("Tagging answers")
for (const answer of answers.filter(answer => answer.printouts.Tags[0].fulltext !== "None")) {
    console.info("Processing tags for ", answer.fulltext)
    const existingAnswer = await aRepo.findByDocurl(answer.fullurl)
    if (existingAnswer) {console.info("Found existing answer", existingAnswer)}

    const tags = answer.printouts.Tags.map(tag => tag.fulltext)

    const existingTags = (await db.queryObject<Tag>("SELECT tags.name FROM tags JOIN answertags ON answertags.tagid = tags.id JOIN answers on answers.id = answertags.answerid WHERE answers.id = $1", [existingAnswer.id])).rows.map(t => t.name)
    const missingTags = tags.filter(t => !existingTags.includes(t))

    console.info({existingTags, missingTags})

    for (const tag of missingTags) {
        console.info("Looking up tag ID for tag", tag)
        const {id} = await tRepo.findByName(tag)
        console.info("Adding tag", id, "to question", existingAnswer.id)
        // console.info(tagid)
        await aRepo.addTagToAnswer({id}, {id: existingAnswer.id})
    }
}