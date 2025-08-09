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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDBCarparkInformationModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const HDBParkingInformationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
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
}, {
    collection: process.env.DB_COLLECTION_NAME,
    versionKey: false
});
exports.HDBCarparkInformationModel = mongoose_1.default.model(process.env.DB_COLLECTION_NAME, HDBParkingInformationSchema);
