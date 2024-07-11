export interface CashAdvancePayment {
    paidAt: string,
    originalAmount: number,
    amountPaid: number,
    remaining: number,
    remarks?: string
}