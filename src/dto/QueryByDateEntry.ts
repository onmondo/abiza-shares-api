import { Length } from "class-validator"

export class QueryByDateEntry {
    @Length(4, 4)
    year!: string
    @Length(3, 512)
    month!: string
}