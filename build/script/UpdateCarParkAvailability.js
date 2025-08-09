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
const CarParkAvailabilityModel_1 = require("../class/CarParkAvailabilityModel");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv.config();
updateCarParkAvailability();
function updateCarParkAvailability() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://api.data.gov.sg/v1/transport/carpark-availability";
        try {
            (0, MongoDBUtils_1.connectToDatabaseMongoose)();
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            if (!data || !data.items || !data.items[0].carpark_data) {
                throw new Error("Invalid data format");
            }
            yield CarParkAvailabilityModel_1.CarParkAvailabilityModel.deleteMany({});
            yield CarParkAvailabilityModel_1.CarParkAvailabilityModel.insertMany(data.items[0].carpark_data.map((carpark) => {
                return new CarParkAvailabilityModel_1.CarParkAvailabilityModel({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    carpark_info: carpark.carpark_info.map((lot) => ({
                        total_lots: Number(lot.total_lots),
                        lot_type: String(lot.lot_type),
                        lots_available: Number(lot.lots_available)
                    })),
                    carpark_number: String(carpark.carpark_number),
                    update_datetime: new Date(carpark.update_datetime)
                });
            }));
        }
        catch (error) {
            console.error("Error fetching car park data:", error);
            return null;
        }
        finally {
            yield mongoose_1.default.connection.close();
        }
    });
}
