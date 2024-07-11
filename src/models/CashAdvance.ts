export interface CashAdvance {
    amount: number,
    date: string,
    remarks: string
    payments?: [
        {
            paidAt: string,
            amount: number,
            remarks?: string
        }
    ]
}