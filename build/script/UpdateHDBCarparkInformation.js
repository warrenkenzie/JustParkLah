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
const MongoDBUtils_1 = require("../utils/MongoDBUtils");
const HDBCarparkInformationModel_1 = require("../class/HDBCarparkInformationModel");
const Utils_1 = require("../utils/Utils");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv.config();
updateCarParkInformation();
function updateCarParkInformation() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, MongoDBUtils_1.connectToDatabaseMongoose)();
        yield HDBCarparkInformationModel_1.HDBCarparkInformationModel.deleteMany({});
        try {
            const carParkInfoResult = yield getCarParkInfo();
            if (carParkInfoResult instanceof Error)
                throw carParkInfoResult;
            const [nextOffset, newTotal] = carParkInfoResult;
            let total = newTotal;
            let offset = nextOffset + 100;
            yield Promise.all(Array.from({ length: (Math.floor(total / 100)) }, (_, i) => getCarParkInfo(offset + i * 100)));
        }
        catch (error) {
            console.error("Error during car park information update:", error);
        }
        finally {
            yield mongoose_1.default.connection.close();
        }
    });
}
function getCarParkInfo() {
    return __awaiter(this, arguments, void 0, function* (offset = 0) {
        const datasetId = "d_23f946fa557947f93a8043bbef41dd09";
        const datasetOffset = offset.toString();
        const url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId + "&offset=" + datasetOffset;
        const response = yield fetch(url);
        if (!response.ok) {
            return new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        if (!data || !data.result || !data.result.records) {
            return new Error("Invalid data format");
        }
        yield HDBCarparkInformationModel_1.HDBCarparkInformationModel.insertMany(data.result.records.map((record) => {
            const x_coord = Number(record.x_coord);
            const y_coord = Number(record.y_coord);
            const [longitude, latitude] = (0, Utils_1.convertCoordinatesToLogLat)(x_coord, y_coord);
            return new HDBCarparkInformationModel_1.HDBCarparkInformationModel({
                _id: new mongoose_1.default.Types.ObjectId(),
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
        }));
        return [Number(data.result.offset), Number(data.result.total)];
    });
}
