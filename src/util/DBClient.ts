import { MongoClient } from "mongodb"

export default class DBClient {
    private static instance: DBClient

    private client: MongoClient

    private constructor () {
        const connectionString: string = process.env.MONGO_LOCAL as string;
        const client = new MongoClient(connectionString);
        this.client = client
    }
    public async getConnection(): Promise<MongoClient> {
        const connection = await this.client.connect()
        return connection
    }

    public static getInstance(): DBClient {
        if (!DBClient.instance) {
            console.log("Creating new db client instance...")
            DBClient.instance = new DBClient()
            return DBClient.instance;
        }

        return DBClient.instance;
    }
}
