import { Request } from "express";
import DBClient from "../util/DBClient";
import { plainToClass } from "class-transformer";
import { CapitalEpenditureEntry } from "../dto/CapitalExpenditureEntry";
import { AppValidationError } from "../util/errors";
import { CostRepository } from "../repository/costRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class CostService {
    repository: CostRepository

    constructor(repository: CostRepository) {
        this.repository = repository
    }

    async GetCapitalExpendituresByMonth(req: Request) {
        const yearLong = req.params.year;
        const monthLong = req.params.month;


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
}