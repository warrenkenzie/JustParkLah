import mongoose, { Document, Schema } from "mongoose";
import * as mongodb from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

interface HDBParkingInformationInterface extends Document {
    _id: mongodb.ObjectId;
    car_park_no: string;
    address: string;
    x_coord: number;
    y_coord: number;
    longitude: number;
    latitude: number;
    car_park_type: string;
    type_of_parking_system: string;
    short_term_parking: string;
    free_parking: string;
    night_parking: string;
    car_park_decks: string;
    gantry_height: string;
    car_park_basement: string;
}

const HDBParkingInformationSchema: Schema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        car_park_no: { type: String, required: true },
        address: { type: String, required: true },
        x_coord: { type: Number, required: true },
        y_coord: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        car_park_type: { type: String, required: true },
        type_of_parking_system: { type: String, required: true },
        short_term_parking: { type: String, required: true },
        free_parking: { type: String, required: true },
        night_parking: { type: String, required: true },
        car_park_decks: { type: String, required: true },
        gantry_height: { type: String, required: true },
        car_park_basement: { type: String, required: true }
    },
    {
        collection: process.env.DB_COLLECTION_NAME!,
        versionKey: false
    }
);

export const HDBCarparkInformationModel = mongoose.model<HDBParkingInformationInterface>(process.env.DB_COLLECTION_NAME!, HDBParkingInformationSchema);