import { Length } from "class-validator"
import { CapitalEpenditureEntry } from "./CapitalExpenditureEntry";

export class UpdateCapitalExpenditureEntry extends CapitalEpenditureEntry {
    @Length(20, 24)
    id!: string
}