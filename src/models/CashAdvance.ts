export interface CashAdvance {
    id: string,
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