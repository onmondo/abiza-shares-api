import { CapitalExpenditure } from "../models/CapitalExpenditure";
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
}