import { ObjectId } from "mongodb";
import { CapitalExpenditure } from "../models/CapitalExpenditure";
import { QueryByDate } from "../models/QueryByDate";
import DBClient from "../util/DBClient";

export class CostRepository {
    async createCost(capitalExpenditure: CapitalExpenditure) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        dbConnection
            .db("abiza-mongodb")
            .collection("expenditures")
            .insertOne({
                ...capitalExpenditure,
                createdAt: new Date(),
                updatedAt: new Date()
            })
    }

    async findCostsByID(id: string): Promise<CapitalExpenditure> {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        const result: unknown = dbConnection
            .db("abiza-mongodb")
            .collection("expenditures")
            .findOne({ "_id": new ObjectId(id) })            

        return result as CapitalExpenditure
    }

    async findCostsByDate(queryDate: QueryByDate): Promise<CapitalExpenditure[]> {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        const cursor = dbConnection
            .db("abiza-mongodb")
            .collection("expenditures")
            .find(queryDate)
            // .limit(10)
            
        const result: unknown = await cursor.toArray();

        return result as CapitalExpenditure[]
    }

    async updateCost(id: string, capitalExpenditure: CapitalExpenditure, queryDate: QueryByDate) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        dbConnection
            .db("abiza-mongodb")
            .collection("expenditures")
            .updateOne(
                { "_id": new ObjectId(id) }, 
                { 
                    $set: {
                        ...capitalExpenditure,
                        ...queryDate,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            )
    }

    async deleteCost(id: string) {
        const dbClient = DBClient.getInstance()
        const dbConnection = await dbClient.getConnection()
        dbConnection
            .db("abiza-mongodb")
            .collection("expenditures")
            .deleteOne({ "_id": new ObjectId(id) })
    }
}