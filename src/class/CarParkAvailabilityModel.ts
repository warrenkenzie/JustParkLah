import mongoose, { Document, Schema } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export interface CarParkAvailabilityInterface extends Document {
    carpark_info: {
        total_lots: number;
        lot_type: string;
        lots_available: number;
    }[];
    carpark_number: string;
    update_datetime: Date;
}

const CarParkAvailabilitySchema = new Schema<CarParkAvailabilityInterface>(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        carpark_info: [
            {
                _id: false,
                total_lots: { type: Number, required: true },
                lot_type: { type: String, required: true },
                lots_available: { type: Number, required: true },
            },
        ],
        carpark_number: { type: String, required: true },
        update_datetime: { type: Date, required: true },
        
    },
    {
        collection: process.env.DB_COLLECTION_NAME_AVAILABILITY,
        versionKey: false,
    }
);

export const CarParkAvailabilityModel = mongoose.model<CarParkAvailabilityInterface>(process.env.DB_COLLECTION_NAME_AVAILABILITY!, CarParkAvailabilitySchema);