import { CashAdvancePayment } from "./CashAdvancePayment"

export interface CashAdvance {
    id: string,
    amount: number,
    date: string,
    remarks: string
    payments?: CashAdvancePayment[]
}