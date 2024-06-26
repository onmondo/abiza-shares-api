import { Length } from "class-validator"

export class QueryByIDEntry {
    @Length(20, 24)
    id!: string
}