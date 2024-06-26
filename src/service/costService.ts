import { Request } from "express";
import { plainToClass } from "class-transformer";
import { CapitalEpenditureEntry } from "../dto/CapitalExpenditureEntry";
import { AppValidationError } from "../util/errors";
import { CostRepository } from "../repository/costRepository";
import { autoInjectable } from "tsyringe";
import { QueryByDateEntry } from "../dto/QueryByDateEntry";
import { QueryByIDEntry } from "../dto/QueryByIDEntry";
import { UpdateCapitalExpenditureEntry } from "../dto/UpdateCapitalExpenditureEntry";
import { CapitalExpenditure } from "../models/CapitalExpenditure";
import { QueryByDate } from "../models/QueryByDate";

@autoInjectable()
export class CostService {
    repository: CostRepository

    constructor(repository: CostRepository) {
        this.repository = repository
    }

    async AddCapitalExpenditure(req: Request): Promise<{ statusCode: number; message: any; }> {
        try {
            const { year, month } = req.params
            const expenditure = plainToClass(CapitalEpenditureEntry, { ...req.body, year, month })
            const error = await AppValidationError(expenditure)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            await this.repository.createCost(expenditure)
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {
            return {
                statusCode: 500,
                message: err
            }
        }
    }

    async GetCapitalExpendituresByMonth(req: Request) {
        try {
            const yearLong = req.params.year;
            const monthLong = req.params.month;
            const queryDate = plainToClass(QueryByDateEntry, { year: yearLong, month: monthLong })
            const error = await AppValidationError(queryDate)
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            const data = await this.repository.findCostsByDate(queryDate)

            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: err
            }
        }

    }
    
    async GetCapitalExpenditureByMonth(req: Request) {
        try {
            const expenditureId = req.params.id;
            const queryID = plainToClass(QueryByIDEntry, { id: expenditureId })
            const error = await AppValidationError(queryID)
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            const data = await this.repository.findCostsByID(queryID.id)

            return {
                statusCode: 200,
                message: "success",
                data
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: err
            }
        }
    }

    async UpdateCapitalExpenditure(req: Request): Promise<{ statusCode: number; message: any; }> {
        try {
            const expenditureId = req.params.id;
            const expenditureUpdate = plainToClass(UpdateCapitalExpenditureEntry, {...req.body, id: expenditureId})
            const error = await AppValidationError(expenditureUpdate)
    
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
            const { id, year, month, date, particulars, totalBill, remarks } = expenditureUpdate
            const capitalExpenditureUpdate: CapitalExpenditure = {
                year,
                month,
                date,
                particulars,
                totalBill,
                remarks,
            }
            const queryDate: QueryByDate = {
                year, month
            }
            await this.repository.updateCost(id, capitalExpenditureUpdate, queryDate)
    
            return {
                statusCode: 200,
                message: "success"
            }
        } catch (err) {
            return {
                statusCode: 500,
                message: err
            }
        }
    }

    async DeleteCapitalExpenditure(req: Request): Promise<{ statusCode: number; message: any; }> {
        try {
            const expenditureId = req.params.id;
            const queryID = plainToClass(QueryByIDEntry, { id: expenditureId })
            const error = await AppValidationError(queryID)
            if (error) {
                return {
                    statusCode: 400,
                    message: error
                }
            }
    
            const data = await this.repository.deleteCost(queryID.id)

            return {
                statusCode: 200,
                message: "success"
            }
            
        } catch (err) {
            return {
                statusCode: 500,
                message: err
            }
        }
    }     
}