import { ObjectId } from "mongodb";
import { ShareHolder } from "../models/ShareHolder";
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
}