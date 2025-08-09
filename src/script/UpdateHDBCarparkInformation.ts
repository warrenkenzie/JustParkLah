import * as dotenv from "dotenv";
import { connectToDatabaseMongoose } from "../utils/MongoDBUtils";
import { HDBCarparkInformationModel } from "../class/HDBCarparkInformationModel"; 
import { convertCoordinatesToLogLat } from "../utils/Utils";
import mongoose from "mongoose";

dotenv.config();
updateCarParkInformation()
async function updateCarParkInformation() {
    await connectToDatabaseMongoose();
    await HDBCarparkInformationModel.deleteMany({});
    try {
        const carParkInfoResult = await getCarParkInfo();
        if (carParkInfoResult instanceof Error) throw carParkInfoResult;
        const [nextOffset, newTotal] = carParkInfoResult;

        let total = newTotal;
        let offset = nextOffset + 100;

        await Promise.all(
            Array.from(
                { length: (Math.floor(total / 100)) },
                (_, i) => getCarParkInfo(offset + i * 100)
            )
        );

    } catch (error) {
        console.error("Error during car park information update:", error);
    } finally {
        await mongoose.connection.close();
    }
}

async function getCarParkInfo(offset: number = 0): Promise<[number, number] | Error> {
    const datasetId = "d_23f946fa557947f93a8043bbef41dd09"
    const datasetOffset = offset.toString();
    const url = "https://data.gov.sg/api/action/datastore_search?resource_id="  + datasetId + "&offset=" + datasetOffset;

    const response = await fetch(url);

    if (!response.ok) {
        return new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.result || !data.result.records) {
        return new Error("Invalid data format");
    }

    await HDBCarparkInformationModel.insertMany(
        data.result.records.map((record: any) => {
            const x_coord = Number(record.x_coord);
            const y_coord = Number(record.y_coord);
            const [longitude, latitude] = convertCoordinatesToLogLat(x_coord, y_coord);

            return new HDBCarparkInformationModel({
                _id: new mongoose.Types.ObjectId(),
                car_park_no: String(record.car_park_no),
                address: String(record.address),
                x_coord: Number(x_coord),
                y_coord: Number(y_coord),
                longitude: Number(longitude),
                latitude: Number(latitude),
                car_park_type: String(record.car_park_type),
                type_of_parking_system: String(record.type_of_parking_system),
                short_term_parking: String(record.short_term_parking),
                free_parking: String(record.free_parking),
                night_parking: String(record.night_parking),
                car_park_decks: String(record.car_park_decks),
                gantry_height: String(record.gantry_height),
                car_park_basement: String(record.car_park_basement)
            });
        })
    );

    return [Number(data.result.offset) ,Number(data.result.total)];
}