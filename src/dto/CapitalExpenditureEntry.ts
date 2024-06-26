import { Length, IsDateString, IsPositive } from "class-validator"
import { QueryByDateEntry } from "./QueryByDateEntry"

export class CapitalEpenditureEntry extends QueryByDateEntry {
    @IsDateString()
    date!: string
    @Length(3, 512)
    particulars!: string
    @IsPositive()
    totalBill!: number
    @Length(3, 512)
    remarks!: string
}