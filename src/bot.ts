import * as dotenv from "dotenv";
import { Bot } from "grammy";
import { strings } from "./utils/String";
import { connectToDatabase } from "./utils/MongoDBUtils";
import { haversineDistance } from "./utils/Utils";
import { HDBCarParkDisplacementArray } from "./class/HDBCarParkDisplacement";
import { getNearestAvailableCarPark } from "./utils/GetNearestCarPark";
import dedent from "dedent";
import mongoose from "mongoose";
import { HDBCarparkInformationModel } from "./class/HDBCarparkInformationModel";
dotenv.config();

mongoose.connect(`${process.env.DB_CONN_STRING}/${process.env.DB_NAME}`);
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
let chatID = "";

bot.command("start", (ctx) => {
    chatID = String(ctx.update.message?.from.id);
    console.log(chatID);
    ctx.reply(strings.start);
});

bot.on("message", async (ctx) => {
    chatID = String(ctx.update.message?.from.id);
    if(ctx.message.location) {
        const destination = {
            latitude: Number(ctx.message.location.latitude),
            longitude: Number(ctx.message.location.longitude)
        };
        
        const hdbCarParkInformationArray = await HDBCarparkInformationModel.find({}, ' _id car_park_no longitude latitude');

        const carParksDisplacementArray: HDBCarParkDisplacementArray[] = hdbCarParkInformationArray.map((hdbCarParkInformation) => {
            return new HDBCarParkDisplacementArray( 
                hdbCarParkInformation._id,
                hdbCarParkInformation.car_park_no,
                haversineDistance(
                    { lat1: destination.latitude, lon1: destination.longitude },
                    { lat2: hdbCarParkInformation.latitude, lon2: hdbCarParkInformation.longitude }
                )
            );
        }).sort((a, b) => a.displacement - b.displacement);

        const getNearestAvailableCarParkResult = await getNearestAvailableCarPark(carParksDisplacementArray);
        if (!getNearestAvailableCarParkResult) throw new Error("getNearestAvailableCarParkResult not found");

        const { availableCarParkInfo, carParkNo, availableCarParkSpots, totalCarParkSpots } = getNearestAvailableCarParkResult;
        const nearestAvailableCarPark = await HDBCarparkInformationModel.findOne({car_park_no: carParkNo});

        if (nearestAvailableCarPark) {
            ctx.reply(
                dedent(
                    `The nearest available car park is: ${nearestAvailableCarPark.address}
                    Percentage of lots that are available: ${((availableCarParkSpots / totalCarParkSpots) * 100).toFixed(2)}%
                    Number of total lots: ${totalCarParkSpots}`
                )
            );
            ctx.replyWithLocation(
                nearestAvailableCarPark.latitude,
                nearestAvailableCarPark.longitude
            );
        } else {
            ctx.reply(strings.noLocation);
        }
    }
    else {
        ctx.reply(strings.pleaseShareDestination);
    }
});

bot.catch((err) => {
    console.error(`Error occurred in bot: ${err}`);
    bot.api.sendMessage(chatID, "Error Occurred, restarting bot");
    bot.start();
});

bot.start();