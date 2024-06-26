import { plainToClass } from "class-transformer";
import { Request } from "express";
import { ShareHolderEntry } from "../dto/ShareHolderEntry";
import { AppValidationError } from "../util/errors";
import { SharesRepository } from "../repository/sharesRepository";
import { autoInjectable } from "tsyringe";
import { QueryByIDEntry } from "../dto/QueryByIDEntry";
import { UpdateShareHolderEntry } from "../dto/UpdateShareHolder";
import { ShareHolder } from "../models/ShareHolder";

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
                message: err
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
                message: err
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
                message: err
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
                message: err
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
                message: err
            }
        }
    }
    
}

