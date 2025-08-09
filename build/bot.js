"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const grammy_1 = require("grammy");
const String_1 = require("./utils/String");
const Utils_1 = require("./utils/Utils");
const HDBCarParkDisplacement_1 = require("./class/HDBCarParkDisplacement");
const GetNearestCarPark_1 = require("./utils/GetNearestCarPark");
const dedent_1 = __importDefault(require("dedent"));
const mongoose_1 = __importDefault(require("mongoose"));
const HDBCarparkInformationModel_1 = require("./class/HDBCarparkInformationModel");
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        mongoose_1.default.connect(`${process.env.DB_CONN_STRING}/${process.env.DB_NAME}`);
        const bot = new grammy_1.Bot(process.env.TELEGRAM_BOT_TOKEN);
        let chatID = "";
        bot.command("start", (ctx) => {
            var _a;
            chatID = String((_a = ctx.update.message) === null || _a === void 0 ? void 0 : _a.from.id);
            console.log(chatID);
            ctx.reply(String_1.strings.start);
        });
        bot.on("message", (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            chatID = String((_a = ctx.update.message) === null || _a === void 0 ? void 0 : _a.from.id);
            if (ctx.message.location) {
                const destination = {
                    latitude: Number(ctx.message.location.latitude),
                    longitude: Number(ctx.message.location.longitude)
                };
                const hdbCarParkInformationArray = yield HDBCarparkInformationModel_1.HDBCarparkInformationModel.find({}, ' _id car_park_no longitude latitude');
                const carParksDisplacementArray = hdbCarParkInformationArray.map((hdbCarParkInformation) => {
                    return new HDBCarParkDisplacement_1.HDBCarParkDisplacementArray(hdbCarParkInformation._id, hdbCarParkInformation.car_park_no, (0, Utils_1.haversineDistance)({ lat1: destination.latitude, lon1: destination.longitude }, { lat2: hdbCarParkInformation.latitude, lon2: hdbCarParkInformation.longitude }));
                }).sort((a, b) => a.displacement - b.displacement);
                const getNearestAvailableCarParkResult = yield (0, GetNearestCarPark_1.getNearestAvailableCarPark)(carParksDisplacementArray);
                if (!getNearestAvailableCarParkResult)
                    throw new Error("getNearestAvailableCarParkResult not found");
                const { availableCarParkInfo, carParkNo, availableCarParkSpots, totalCarParkSpots } = getNearestAvailableCarParkResult;
                const nearestAvailableCarPark = yield HDBCarparkInformationModel_1.HDBCarparkInformationModel.findOne({ car_park_no: carParkNo });
                if (nearestAvailableCarPark) {
                    ctx.reply((0, dedent_1.default)(`The nearest available car park is: ${nearestAvailableCarPark.address}
                        Percentage of lots that are available: ${((availableCarParkSpots / totalCarParkSpots) * 100).toFixed(2)}%
                        Number of total lots: ${totalCarParkSpots}`));
                    ctx.replyWithLocation(nearestAvailableCarPark.latitude, nearestAvailableCarPark.longitude);
                }
                else {
                    ctx.reply(String_1.strings.noLocation);
                }
            }
            else {
                ctx.reply(String_1.strings.pleaseShareDestination);
            }
        }));
        bot.catch((err) => {
            console.error(`Error occurred in bot: ${err}`);
            bot.api.sendMessage(chatID, `Error Occurred, restarting bot`);
            bot.start();
        });
        bot.start();
    });
}
main().catch((error) => {
    console.error("Error starting main:", error);
    mongoose_1.default.connection.close();
});
