import { QueryByDate } from "./QueryByDate"

export interface CapitalExpenditure extends QueryByDate {
    date: string
    particulars: string
    totalBill: number
    remarks: string
}