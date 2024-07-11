import { ObjectId } from "mongodb";
import { ShareHolder } from "../models/ShareHolder";
import { CashAdvance } from "../models/CashAdvance";
import DBClient from "../util/DBClient";

export class SharesRepository {
    async createShareHolder(shareHolder: ShareHolder) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        
        dbConnection
            .db("abiza-mongodb")
            .collection("shareholders")
            .insertOne({
                ...shareHolder,
                createdAt: new Date(),
                updatedAt: new Date()
            })
    }

    async findAllShareHolders() {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()

        const cursor = dbConnection
        .db("abiza-mongodb")
        .collection("shareholders")
        .find()
        
        const result: unknown = await cursor.toArray();

        return result as ShareHolder[]
    }

    async findShareHolderById(id: string) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        const result: unknown = dbConnection
            .db("abiza-mongodb")
            .collection("shareholders")
            .findOne({ "_id": new ObjectId(id) })            

        return result as ShareHolder
    }    

    async updateShareHolder(id: string, shareHolder: ShareHolder) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        
        dbConnection
            .db("abiza-mongodb")
            .collection("shareholders")
            .updateOne(
                { "_id": new ObjectId(id) }, 
                { 
                    $set: {
                        ...shareHolder,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            )
    }

    async deleteShareHolder(id: string) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        
        dbConnection
            .db("abiza-mongodb")
            .collection("shareholders")
            .deleteOne({ "_id": new ObjectId(id) })
    }

    async addCashAdvance(id: string, cashAdvance: CashAdvance) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        
        const insertResult = await dbConnection
            .db("abiza-mongodb")
            .collection("cashadvances")
            .insertOne({
                ...cashAdvance,
                createdAt: new Date(),
                updatedAt: new Date()
            })

        dbConnection
            .db("abiza-mongodb")
            .collection<ShareHolder>("shareholders")
            .updateOne(
                { "_id": new ObjectId(id) }, 
                { 
                    $set: {
                        updatedAt: new Date()
                    },
                    $push: {
                        cashAdvances: insertResult.insertedId,
                    }
                }
            )
    }  
    
    async findAllShareHoldersCashAdvances(id: string) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        const shareHolder: unknown = await dbConnection
            .db("abiza-mongodb")
            .collection("shareholders")
            .findOne({ "_id": new ObjectId(id) })

        const { cashAdvances } = shareHolder as ShareHolder
        const result: unknown = dbConnection
            .db("abiza-mongodb")
            .collection("cashadvances")
            .find({"_id": { $in: cashAdvances}})
            .toArray()

        return result
    }

    async findShareHoldersCashAdvanceById(id: string) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()

        const result: unknown = dbConnection
            .db("abiza-mongodb")
            .collection("cashadvances")
            .findOne({"_id": new ObjectId(id)})
            
        return result as CashAdvance
    }

    async deleteShareHoldersCashAdvanceById(cashAdvanceId: string) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        
        // need to upgrade this into a transaction type db operation
        const cashAdvance: unknown = await dbConnection
        .db("abiza-mongodb")
        .collection("cashadvances")
        .findOne({"_id": new ObjectId(cashAdvanceId)})
        
        const { id, payments } = cashAdvance as CashAdvance
        
        if (payments && payments.length > 0) {
            throw Error("The cash advance already has existing payments and cannot be revoked.")
        }

        await dbConnection
            .db("abiza-mongodb")
            .collection<ShareHolder>("shareholders")
            .updateOne(
                { "_id": new ObjectId(id) }, 
                { 
                    $set: {
                        updatedAt: new Date()
                    },
                    $pull: {
                        cashAdvances: new ObjectId(cashAdvanceId),
                    }
                }
            )

        await dbConnection
            .db("abiza-mongodb")
            .collection("cashadvances")
            .deleteOne({ "_id": new ObjectId(cashAdvanceId) })
    }
}