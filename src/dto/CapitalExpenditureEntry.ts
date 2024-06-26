import { Length, IsDateString, IsPositive } from "class-validator"

export class CapitalEpenditureEntry {
    @Length(4, 4)
    year!: string
    @Length(3, 512)
    month!: string
    @IsDateString()
    date!: string
    @Length(3, 512)
    particulars!: string
    @IsPositive()
    totalBill!: number
    @Length(3, 512)
    remarks!: string
}