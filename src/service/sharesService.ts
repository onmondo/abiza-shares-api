import { plainToClass } from "class-transformer";
import { Request } from "express";
import { ShareHolderEntry } from "../dto/ShareHolderEntry";
import { AppValidationError } from "../util/errors";
import { SharesRepository } from "../repository/sharesRepository";
import { autoInjectable } from "tsyringe";
import { QueryByIDEntry } from "../dto/QueryByIDEntry";
import { UpdateShareHolderEntry } from "../dto/UpdateShareHolder";
import { ShareHolder } from "../models/ShareHolder";
import { ShareHolderCashAdvanceEntry } from "../dto/ShareHolderCashAdvanceEntry";
import { CashAdvancePaymentEntry } from "../dto/CashAdvancePaymentEntry";
import { ObjectId } from "mongodb";
import Big from "big.js";

@autoInjectable()
export class SharesService {

    repository: SharesRepository

    constructor(repository: SharesRepository) {
        this.repository = repository
    }

    async AddShareHolder(req: Request) {
        try {
            const newShareHolder = plainToClass(ShareHolderEntry, req.body)
            const error = await AppValidationError(newShareHolder)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            await this.repository.createShareHolder({...newShareHolder, isActive: true})
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async GetShareHolders(req: Request) {
        try {
            const data = await this.repository.findAllShareHolders()

            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }

    }   
    
    async GetShareHolderById(req: Request) {
        try {
            const shareHolderId = req.params.id;
            const queryID = plainToClass(QueryByIDEntry, { id: shareHolderId })
            const data = await this.repository.findShareHolderById(queryID.id)

            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }

    } 

    async UpdateShareHolder(req: Request) {
        try {
            const shareHolderId = req.params.id;
            const shareHolder = plainToClass(UpdateShareHolderEntry, {...req.body, id: shareHolderId})
            const error = await AppValidationError(shareHolder)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }

            const { id, name, percentage, isActive, isOwner } = shareHolder
            const updateShareHolder: ShareHolder = {
                name, percentage, isActive, isOwner
            }

            await this.repository.updateShareHolder(id, updateShareHolder)
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }
    async DeleteShareHolder(req: Request) {
        try {
            const shareHolderId = req.params.id;
            const queryID = plainToClass(QueryByIDEntry, { id: shareHolderId })
            const error = await AppValidationError(queryID)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            await this.repository.deleteShareHolder(queryID.id)
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {

            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async AddCashAdvance(req: Request) {
        try {
            const shareHolderId = req.params.id;
            const newCashAdvance = plainToClass(ShareHolderCashAdvanceEntry, {...req.body, id: shareHolderId})
            const error = await AppValidationError(newCashAdvance)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            await this.repository.addCashAdvance(shareHolderId, newCashAdvance)
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async GetShareHoldersCashAdvances(req: Request) {
        try {
            const shareHolderId = req.params.id;
            const data = await this.repository.findAllShareHoldersCashAdvances(shareHolderId)
            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async GetShareHoldersCashAdvanceById(req: Request) {
        try {
            const cashAdvanceId = req.params.id;
            const data = await this.repository.findShareHoldersCashAdvanceById(cashAdvanceId)
            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }      
    
    async DeleteShareHoldersCashAdvanceById(req: Request) {
        try {
            const cashAdvanceId = req.params.id;
            const data = await this.repository.deleteShareHoldersCashAdvanceById(cashAdvanceId)
            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async PayCashAdvance(req: Request) {
        try {
            const cashAdvanceId = req.params.id;
            const payment = plainToClass(CashAdvancePaymentEntry, {...req.body, id: cashAdvanceId})
            const error = await AppValidationError(payment)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }

            const { amount, payments } = await this.repository.findShareHoldersCashAdvanceById(cashAdvanceId)
            let originalAmount = amount

            if (payments && payments.length > 0) {
                originalAmount = payments[payments.length - 1].remaining
            }

            await this.repository.createPayment(cashAdvanceId, {
                ...payment,
                originalAmount,
                remaining: Big(originalAmount).minus(Big(payment.amountPaid)).toNumber()
            })
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async GetPaymentFromCashAdvances(req: Request) {
        try {
            const cashAdvanceId = req.params.id;
            const data = await this.repository.findAllPaymentsFromCashAdvance(cashAdvanceId)
            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }

    async CancelPaymentFromCashAdvance(req: Request) {
        try {
            const cashAdvanceId = req.params.id;
            const payment = plainToClass(CashAdvancePaymentEntry, {...req.body, id: cashAdvanceId})
            const error = await AppValidationError(payment)

            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }

            const { amount, payments } = await this.repository.findShareHoldersCashAdvanceById(cashAdvanceId)
            let originalAmount = amount

            if (payments && payments.length > 0) {
                originalAmount = payments[payments.length - 1].remaining
            }

            await this.repository.createPayment(cashAdvanceId, {
                ...payment,
                originalAmount,
                remaining: Big(originalAmount).plus(Big(payment.amountPaid)).toNumber()
            })

            return {
                statusCode: 200,
                message: "success",
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: (err as Error).message
            }
        }
    }    
}

