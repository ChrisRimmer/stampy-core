import { db } from "../utils/db.ts";
import { NewTag, Tag } from "./types.ts"

export const createOne = async (tag: NewTag) => {
    const fields = Object.keys(tag).join(", ")
    const values = Object.values(tag).join(", ")
    await db.queryObject(`INSERT INTO tags (${fields}) values ($values)`, {values})
}

export const createMany = async (tags: NewTag[]) => {
    for (const tag of tags) {
        await createOne(tag)
    }
}

export const findByName = async (name: Tag["name"]): Promise<Tag> => {
    return (await db.queryObject<Tag>(`SELECT * FROM tags WHERE tags.name = $1`, [name])).rows[0]
}