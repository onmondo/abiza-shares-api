import { IsDateString, IsNumber, Length } from "class-validator";

export class ShareHolderCashAdvanceEntry {
    @Length(20, 24)
    id!: string
    @Length(3, 512)
    remarks!: string
    @IsNumber()
    amount!: number
    @IsDateString()
    date!: string
}