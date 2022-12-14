import { Option } from "../../shared/typeTools.ts";

export type Tag = {
    id: number,
    name: string,
    isvisible: boolean,
}

export type NewTag = Omit<Option<Tag, "isvisible">, "id">