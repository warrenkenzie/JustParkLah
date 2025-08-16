import * as dotenv from "dotenv";
import { connectToDatabaseMongoose, ifCollectionExists } from "../utils/MongoDBUtils";
import { CarParkAvailabilityModel } from "../class/CarParkAvailabilityModel";
import mongoose from "mongoose";
dotenv.config()
updateCarParkAvailability();
async function updateCarParkAvailability() {

    const url = "https://api.data.gov.sg/v1/transport/carpark-availability";
    try {
        connectToDatabaseMongoose();
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }  

        const data = await response.json();
        if (!data || !data.items || !data.items[0].carpark_data) {
            throw new Error("Invalid data format");
        }
        
        const checkCollectionExists = await ifCollectionExists(CarParkAvailabilityModel.collection.name) || false
        if(checkCollectionExists) await CarParkAvailabilityModel.deleteMany({})
        await CarParkAvailabilityModel.insertMany(
            data.items[0].carpark_data.map((carpark: any) => {
                return new CarParkAvailabilityModel({
                    _id: new mongoose.Types.ObjectId(),
                    carpark_info: carpark.carpark_info.map((lot: any) => ({
                        total_lots: Number(lot.total_lots),
                        lot_type: String(lot.lot_type),
                        lots_available: Number(lot.lots_available)
                    })),
                    carpark_number: String(carpark.carpark_number),
                    update_datetime: new Date(carpark.update_datetime)
                });
            })
        );
    } catch (error) {
        console.error("Error fetching car park data:", error);
        return null;
    } finally {
        await mongoose.connection.close();
    }
}