import * as mongoDB from "mongodb";
import mongoose from "mongoose";

export async function connectToDatabase(): Promise<{ client: mongoDB.MongoClient, db: mongoDB.Db, carparkCollection: mongoDB.Collection, availableCarParkCollection: mongoDB.Collection }> {

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.DB_NAME!);
    const carparkCollection: mongoDB.Collection = db.collection(process.env.DB_COLLECTION_NAME!);
    const availableCarParkCollection: mongoDB.Collection = db.collection(process.env.DB_COLLECTION_NAME_AVAILABILITY!);
    console.info(`Successfully connected to database: ${db.databaseName} and collection: ${carparkCollection.collectionName}`);
    console.info(`Successfully connected to database: ${db.databaseName} and collection: ${availableCarParkCollection.collectionName}`);

    return { client, db, carparkCollection, availableCarParkCollection };
}

export async function connectToDatabaseMongoose() {
    mongoose.connect(`${process.env.DB_CONN_STRING}/${process.env.DB_NAME}`);
    const db = mongoose.connection;
    console.info(`Successfully connected to database through mongoose: ${db.name}`);
}
