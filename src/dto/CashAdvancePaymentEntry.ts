import { IsDateString, IsNumber, Length } from "class-validator";

export class CashAdvancePaymentEntry {
    @Length(20, 24)
    id!: string
    @Length(3, 512)
    remarks!: string
    @IsNumber()
    amountPaid!: number
    @IsDateString()
    paidAt!: string
}